---
id: 69
title: "JPA Properties"
summary: "Spring Boot에서 JPA와 Hibernate 관련 properties를 어떻게 보고, SQL 로그를 어떤 조합으로 켤지 정리한 노트."
tags:
  - technology
  - spring
  - java
  - jpa
  - hibernate
  - logging
created: 2026-04-20
updated: 2026-04-20
---
# JPA properties

Spring Boot에서 JPA properties는 단순 옵션 모음이 아니라, **Hibernate 동작과 SQL 로그 가시성을 어떻게 조절할지**를 정하는 설정 집합이다.  
실무에서는 특히 SQL 로그를 어느 수준까지 볼지에 대한 조합을 자주 다룬다.

## 한눈에 보기

| 항목 | 설명 |
| --- | --- |
| 대표 prefix | `spring.jpa.*`, `spring.jpa.properties.hibernate.*` |
| 자주 보는 설정 | `show_sql`, `format_sql`, `use_sql_comments` |
| 로그 레벨 연계 | `logging.level.org.hibernate.SQL`, 바인딩 파라미터 trace |
| 주의점 | `show_sql`과 logger 출력은 성격이 다름 |

## 1. 왜 정리해 둘 필요가 있나

JPA/Hibernate는 설정이 많지만, 실무에서 자주 손대는 건 크게 두 종류다.

- 런타임 동작에 영향을 주는 ORM 설정
- SQL을 얼마나 잘 보이게 할지에 대한 로그 설정

초기 개발이나 성능 분석, 장애 대응에서는 두 번째가 특히 중요하다.

## 2. 가장 자주 보는 SQL 관련 옵션

### 2-1. `show_sql`

```properties
spring.jpa.properties.hibernate.show_sql=true
```

이 설정은 Hibernate가 실행 SQL을 출력하게 한다.  
참고 자료 기준으로 `show_sql`은 콘솔에 직접 보이는 방식이고, logger 설정과는 출력 경로 성격이 다를 수 있다.

### 2-2. `format_sql`

```properties
spring.jpa.properties.hibernate.format_sql=true
```

SQL을 여러 줄로 보기 좋게 포맷팅해 준다.  
복잡한 쿼리를 읽을 때 훨씬 편하다.

### 2-3. `use_sql_comments`

```properties
spring.jpa.properties.hibernate.use_sql_comments=true
```

Hibernate가 SQL에 코멘트를 붙여서 어느 엔티티/동작에서 나온 쿼리인지 파악하는 데 도움이 된다.

## 3. logger 설정과 같이 보기

실무에서는 단순 `show_sql`보다 logger 기반으로 맞추는 쪽이 더 유연한 경우가 많다.

```properties
logging.level.org.hibernate.SQL=debug
logging.level.org.hibernate.type.descriptor.sql=trace
```

이 조합은:

- 실행 SQL 자체를 보고
- 바인딩 파라미터까지 더 자세히 확인

하는 데 유용하다.

다만 환경에 따라 클래스 경로나 세부 logger 이름은 Hibernate 버전에 맞게 확인해야 한다.

## 4. 추천 관점

| 목적 | 추천 조합 |
| --- | --- |
| 로컬에서 SQL만 빠르게 보기 | `show_sql`, `format_sql` |
| 실제 logger 체계로 관리 | `logging.level.org.hibernate.SQL=debug` |
| 바인딩 값까지 추적 | SQL debug + 타입/바인딩 trace |
| 운영 환경 | 필요한 범위만 제한적으로 사용 |

즉, 개발 편의와 운영 안정성을 분리해서 생각해야 한다.

## 5. 주의할 점

- SQL 로그를 많이 켜면 로그량이 급증한다.
- 운영 환경에서 trace 수준은 부담이 크다.
- `show_sql`은 빠르게 보기 좋지만, logger 기반 수집과는 별개로 생각해야 한다.
- 포맷팅과 코멘트는 가독성에는 좋지만 로그량도 늘린다.

## 6. 정리

JPA properties는 전부 외우는 것보다, **지금 내가 원하는 게 ORM 동작 제어인지 SQL 관찰성인지**를 먼저 구분하는 게 중요하다.

특히 SQL을 볼 때는:

1. `show_sql`
2. `format_sql`
3. `use_sql_comments`
4. Hibernate logger level

이 네 가지를 조합해 상황에 맞게 쓰는 것이 실무적으로 가장 자주 필요하다.

## References

- https://zzang9ha.tistory.com/399
- https://lannstark.tistory.com/14
