---
id: 36
title: "MySQL Index and Query Planning"
summary: "MySQL에서 인덱스 활용 조건, `GROUP BY` 정렬 비용, 부분 문자열 검색 전략을 실행 계획 관점에서 정리한 노트."
tags:
  - technology
  - database
  - mysql
  - indexing
  - query-optimization
created: 2026-04-20
updated: 2026-04-20
---
# MySQL Index and Query Planning

MySQL을 볼 때 중요한 건 "인덱스가 있다"보다 **어떤 비교 방식과 실행 계획에서 인덱스를 실제로 활용할 수 있는가**다.  
실무에서는 같은 `WHERE`, `GROUP BY`, `LIKE` 조건이라도 비교 타입, 정렬 필요 여부, 검색 패턴에 따라 성능 차이가 크게 난다.

## 한눈에 보기

| 항목 | 설명 |
| --- | --- |
| 한 줄 정의 | 관계형 데이터를 저장하고 SQL로 조회하는 범용 DBMS |
| 실무 핵심 | 인덱스를 만들었는지보다 인덱스를 탈 수 있는 쿼리인지가 더 중요 |
| 자주 보는 이슈 | 타입 변환으로 인한 인덱스 미사용, `GROUP BY` 정렬 비용, `%keyword%` 검색 |
| 바로 확인할 것 | `EXPLAIN`, 조건식의 타입 일치, `ORDER BY` 필요 여부, 검색 패턴 |

## 목차

1. MySQL을 볼 때의 기본 관점
2. 인덱스와 `MUL`의 의미
3. 인덱스를 못 타는 대표 사례
4. `GROUP BY`와 filesort
5. 부분 문자열 검색과 trigram 관점
6. 실무 체크리스트
7. 정리
8. References

## 1. MySQL을 볼 때의 기본 관점

MySQL에서 성능을 이야기할 때는 보통 아래 세 가지를 같이 본다.

| 관점 | 질문 |
| --- | --- |
| 접근 경로 | 원하는 행을 인덱스로 좁혀서 찾는가, 아니면 많이 읽는가 |
| 정렬/집계 비용 | 결과를 만들기 위해 임시 테이블이나 filesort가 필요한가 |
| 조건 표현 방식 | 비교 타입, 함수 사용, 검색 패턴 때문에 인덱스를 못 타고 있지 않은가 |

즉, 인덱스 설계와 쿼리 작성은 따로 떨어진 문제가 아니다.  
**스키마에 있는 인덱스가 쿼리의 비교 방식과 맞아야 실행 계획에서 이점이 나온다.**

## 2. 인덱스와 `MUL`의 의미

`SHOW COLUMNS`나 관리 도구에서 `MUL`이 보이면, 그 컬럼이 **중복을 허용하는 인덱스의 일부**라는 뜻으로 이해하면 된다.

| 키 표시 | 의미 |
| --- | --- |
| `PRI` | 기본 키 |
| `UNI` | 고유 인덱스 |
| `MUL` | 중복 가능한 일반 인덱스 또는 다중 행이 연결될 수 있는 인덱스 |

`MUL`은 "좋은 인덱스"라는 뜻이 아니라, **고유성을 강제하지 않는 인덱스 상태**를 보여 주는 표시다.  
외래 키 컬럼이나 자주 필터링하는 일반 컬럼에서 흔히 본다.

예를 들어 다음과 같은 인덱스는 `category_id`에 중복을 허용한다.

```sql
CREATE TABLE example_table (
    id INT AUTO_INCREMENT,
    name VARCHAR(100),
    category_id INT,
    INDEX category_idx (category_id),
    PRIMARY KEY (id)
);
```

이런 인덱스는 `WHERE category_id = ?` 같은 조회에는 유리하지만, 인덱스가 많아질수록 쓰기 비용은 늘어난다.

## 3. 인덱스를 못 타는 대표 사례

### 3-1. 비교 타입이 컬럼 타입과 어긋나는 경우

MySQL은 숫자와 문자열을 비교할 때 자동 타입 변환을 수행한다.  
문제는 **상수 쪽이 아니라 컬럼 쪽이 변환되는 경우**다.

```sql
SELECT * FROM zipcode WHERE code_serial_num = '10000001';
SELECT * FROM zipcode WHERE code = 10000001;
```

위 두 쿼리는 겉보기엔 비슷하지만 의미가 다르다.

| 쿼리 형태 | 가능성이 큰 동작 |
| --- | --- |
| 숫자 컬럼 = 문자열 상수 | 상수를 숫자로 바꿔 비교하므로 인덱스 활용 가능성이 높음 |
| 문자열 컬럼 = 숫자 상수 | 컬럼 값을 숫자로 바꿔 비교하게 되어 인덱스를 못 탈 수 있음 |

실무적으로는 다음처럼 기억하면 편하다.

- 비교 상수 타입을 컬럼 타입에 맞춘다.
- 문자열 컬럼에 숫자 리터럴을 바로 비교하지 않는다.
- 실행 계획은 감으로 보지 말고 `EXPLAIN`으로 확인한다.

### 3-2. 인덱스 컬럼에 함수를 적용하는 경우

인덱스는 보통 정렬된 값 범위를 기준으로 빠르게 좁혀 간다.  
그런데 `WHERE LOWER(name) = 'foo'`처럼 컬럼 값을 가공해 버리면, 원래 정렬 상태를 그대로 활용하기 어려워진다.

핵심은 다음 한 줄이다.

> 인덱스를 만들었더라도, 조건식이 컬럼 값을 변형하는 방식이면 MySQL이 전체를 더 많이 읽게 될 수 있다.

## 4. `GROUP BY`와 filesort

MySQL에서는 `GROUP BY`가 단순 그룹화로 끝나지 않고, 정렬 비용까지 같이 붙는 경우가 있다.  
실행 계획의 `Extra`에서 `Using temporary; Using filesort`가 보이면 임시 테이블과 정렬 작업이 같이 발생한 것이다.

```sql
EXPLAIN SELECT * FROM user GROUP BY name;
EXPLAIN SELECT * FROM user GROUP BY name ORDER BY NULL;
```

참고한 사례에서는 `ORDER BY NULL`을 추가했을 때 `filesort`가 빠지고 `Using temporary`만 남았다.  
즉, **업무적으로 정렬이 필요 없는 GROUP BY라면 정렬 비용을 줄일 여지가 있다**는 뜻이다.

| 상황 | 의미 |
| --- | --- |
| `GROUP BY`만 사용 | MySQL이 정렬까지 수행할 수 있음 |
| `GROUP BY ... ORDER BY NULL` | 정렬이 불필요함을 명시해 filesort를 피할 수 있는 경우가 있음 |

다만 이건 "항상 붙여야 하는 문법"이 아니라, **결과를 정렬된 상태로 받아야 하는지 먼저 판단한 뒤** 적용해야 한다.

## 5. 부분 문자열 검색과 trigram 관점

### 5-1. 접두 검색과 부분 검색은 다르다

일반 B-Tree 인덱스는 앞에서부터 비교해 범위를 좁혀 가는 데 강하다.  
그래서 아래 둘은 체감 차이가 크다.

```sql
WHERE fqdn LIKE 'rs.drown%'
WHERE fqdn LIKE '%drown%'
```

접두 검색은 인덱스 정렬 순서를 활용하기 쉽지만, `%drown%`처럼 앞이 비어 있는 검색은 **어디에서 일치할지 모르기 때문에** 훨씬 많은 행이나 인덱스 엔트리를 읽게 된다.

### 5-2. substring 검색이 정말 중요하면 별도 전략이 필요하다

참고한 trigram 사례는 문자열을 3글자 조각으로 나눠 별도 인덱스 테이블로 관리하는 접근을 보여 준다.

예를 들어 `"drown"`은 다음 trigram으로 나눌 수 있다.

```text
dro, row, own
```

이 값을 별도 테이블에 저장해 두면, `%drown%`를 바로 전체 스캔하는 대신:

1. `dro`, `row`, `own`을 모두 가진 후보 ID를 먼저 찾고
2. 그 결과를 원본 테이블과 조인하고
3. 마지막에 실제 `LIKE '%drown%'`로 검증

하는 식으로 범위를 크게 줄일 수 있다.

이 전략은 다음 상황에서 특히 의미가 있다.

| 상황 | 추천 관점 |
| --- | --- |
| 접두 검색 위주 | 기본 인덱스 + `LIKE 'prefix%'` |
| 문서형 자연어 검색 | Full-text 또는 검색 엔진 검토 |
| 도메인, 식별자, 코드 조각 검색 | n-gram/trigram 같은 별도 색인 전략 검토 |

## 6. 실무 체크리스트

- `EXPLAIN`에서 실제 접근 경로와 `rows`, `Extra`를 먼저 본다.
- 컬럼 타입과 비교 상수 타입을 맞춘다.
- 인덱스 컬럼에 함수나 변환을 걸지 않는 쪽으로 먼저 쿼리를 정리한다.
- `GROUP BY`는 그룹화만 필요한지, 정렬까지 필요한지 분리해서 본다.
- `%keyword%` 검색이 핵심 기능이면 일반 인덱스만으로 해결하려 하지 않는다.
- 일반 인덱스는 읽기를 빠르게 하지만, 쓰기 비용과 저장 비용을 늘린다는 점을 같이 본다.

## 7. 정리

MySQL 성능의 출발점은 "인덱스가 있다"가 아니라 **현재 쿼리가 그 인덱스를 탈 수 있게 작성되었는가**다.

특히 아래 세 가지는 반복해서 마주친다.

1. 타입 변환 때문에 인덱스를 못 타는 조건
2. `GROUP BY`에서 불필요하게 발생하는 정렬 비용
3. `%keyword%` 형태의 부분 문자열 검색을 일반 인덱스로 해결하려는 시도

그래서 MySQL 노트는 기능 목록보다도, **실행 계획을 어떻게 읽고 어떤 조건이 비용을 키우는지**를 중심으로 보는 편이 실무적으로 더 도움이 된다.

## References

- https://www.basedash.com/blog/mul-key-in-mysql-a-guide
- https://idea-sketch.tistory.com/51
- https://intomysql.blogspot.com/2010/12/group-by-filesort.html
- https://blog.dan.drown.org/database-substring-indexes/
