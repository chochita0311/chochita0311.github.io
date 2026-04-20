---
id: 78
title: "Querydsl with Spring Data JPA"
summary: "Querydsl의 타입 안전한 쿼리 모델과 Spring Data JPA와의 연결 방식을 정리한 노트."
tags:
  - technology
  - spring
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Querydsl with Spring Data JPA

## 한눈에 보기
Querydsl은 문자열 JPQL 대신 타입 안전한 쿼리 모델을 제공하는 라이브러리다. 컴파일 시점에 생성된 Q 타입을 이용해 조건식, 조인, 정렬, 페이징을 자바 코드로 조합할 수 있어서, 동적 조건이 많은 조회에서 특히 강하다.

## 왜 쓰는가
복잡한 검색 화면이나 관리 기능에서는 조건 조합이 자주 바뀐다. 이때 메서드 이름 기반 쿼리는 금방 한계가 오고, 문자열 JPQL은 오타와 리팩터링 취약성이 크다. Querydsl은 이런 지점에서 다음 장점을 준다.

- 필드명 변경 시 컴파일 오류로 드러난다.
- 조건 조합을 함수처럼 분리하기 쉽다.
- 동적 `where` 절 구성에 적합하다.
- 정렬, 페이징, 조인을 일관된 문법으로 표현할 수 있다.

## 동작 방식
핵심은 annotation processing으로 생성되는 Q 타입이다. 엔티티 `Member`가 있으면 `QMember`가 생기고, 이를 기준으로 `member.name.eq("...")` 같은 식을 작성한다. 즉 Querydsl은 ORM을 대체하는 것이 아니라, JPA/Hibernate 위에서 쿼리 표현 계층을 더 정교하게 만드는 도구다.

## 왜 Spring Data JPA와 잘 붙는가
Spring Data JPA가 기본 CRUD와 repository 추상화를 담당하고, Querydsl이 복잡한 읽기 쿼리 조립을 담당하면 역할 분리가 자연스럽다. 즉 "쓰기 모델은 repository 기본 기능", "읽기 모델은 Querydsl 기반 custom repository" 식으로 나누기 좋다.

## Spring Data JPA와 함께 쓰는 패턴
실무에서는 보통 사용자 정의 repository 구현에 `JPAQueryFactory`를 주입해 사용한다. 단순 CRUD는 기본 repository에 두고, 동적 검색과 조인 로직은 Querydsl 구현체로 분리하면 역할이 명확해진다.

이 방식이 좋은 이유는 다음과 같다.

- 조회 전용 복잡 쿼리를 한 곳에 모을 수 있다.
- 서비스 계층에서 조건 조합 세부사항이 사라진다.
- 테스트와 리팩터링이 쉬워진다.

## 날짜/함수 처리
Querydsl은 타입 안전성을 주지만, DB 벤더 함수까지 완전히 추상화해주지는 않는다. 예를 들어 MySQL의 `DATE_FORMAT`처럼 벤더 함수를 써야 하는 경우 `Expressions.stringTemplate(...)` 같은 방식으로 함수 표현을 직접 넣게 된다.

즉 Querydsl을 써도 다음은 여전히 남는다.

- DB 함수 의존성
- 벤더별 날짜/문자열 함수 차이
- 인덱스를 깨는 함수 적용 여부

그래서 "타입 안전"과 "DB 독립성"을 같은 말로 보면 안 된다.

## 언제 과하고 언제 적절한가
조건이 단순하고 정적인 조회라면 `@Query`만으로 충분한 경우가 많다. 반면 조건 조합이 자주 바뀌고 검색 화면이 복잡할수록 Querydsl 쪽이 유지보수성이 좋아진다. 결국 Querydsl의 가치는 문법 예쁨보다 "복잡한 동적 조회를 버틸 구조"를 준다는 데 있다.

## 한계
Querydsl은 강력하지만 도입 비용이 있다.

- Q 타입 생성 설정이 필요하다.
- 단순 조회에는 오히려 과할 수 있다.
- 팀이 문법에 익숙하지 않으면 진입장벽이 있다.

정적이고 간단한 쿼리라면 `@Query`만으로 충분한 경우도 많다.

## 정리
Querydsl은 복잡한 동적 조회를 다루는 데 가장 실용적인 선택지 중 하나다. 다만 "쿼리를 자바 코드로 쓴다"는 장점보다, Q 타입을 기반으로 조건을 조립하고 repository 읽기 모델을 분리하기 좋다는 점이 더 중요하다. 날짜 함수 같은 DB 특화 표현은 결국 벤더 의존성을 남기므로 그 경계는 따로 인식해야 한다.

## References
- [Querydsl Reference](http://querydsl.com/static/querydsl/4.0.1/reference/ko-KR/html_single/#d0e120)
- [Querydsl GitHub](https://github.com/querydsl/querydsl)
- [Baeldung: Intro to Querydsl](https://www.baeldung.com/intro-to-querydsl)
- [Querydsl에서 datetime을 DATE_FORMAT 하여 사용하는 방법](https://green-joo.tistory.com/51)
