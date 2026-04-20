---
id: 68
title: "Spring Data JPA Query Methods"
summary: "Spring Data JPA의 query derivation, `@Query`, projection 방식을 비교하고 어떤 상황에서 어느 표현이 적절한지 정리한 노트."
tags:
  - technology
  - spring
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Spring Data JPA Query Methods

## 한눈에 보기
Spring Data JPA는 메서드 이름으로 쿼리를 유도하는 `query derivation`, JPQL이나 네이티브 SQL을 직접 적는 `@Query`, 그리고 projection 조합으로 대부분의 조회 요구를 표현할 수 있다. 중요한 건 "어떤 문법이 가능하냐"보다 "어느 수준까지 repository 메서드에 의미를 실을 것인가"다.

## Query Derivation
메서드 이름 기반 쿼리는 단순 조회에서 생산성이 높다. `findByStatusAndCreatedAtAfterOrderByIdDesc`처럼 이름만으로 필터와 정렬이 드러나기 때문에, 쿼리 의도가 비교적 선명하다.

하지만 조건이 길어질수록 메서드 이름이 빠르게 비대해진다. 이 시점이 보통 `@Query`나 별도 DSL로 넘어갈 신호다. 메서드 이름이 도메인 언어를 설명하는 수준을 넘어서 SQL 파서를 흉내 내기 시작하면 유지보수성이 떨어진다.

## `@Query`가 필요한 경우
`@Query`는 다음 상황에서 유리하다.

- 조인과 서브쿼리가 들어간다.
- 이름 유도로 표현하기 어려운 조건 조합이 있다.
- DTO 생성자 projection처럼 반환 형태를 명시하고 싶다.
- 네이티브 SQL이 필요한 데이터베이스 기능을 쓴다.

즉 `@Query`는 "메서드 이름이 너무 길어져서"뿐 아니라, 반환 구조와 실행 SQL을 더 직접 통제해야 할 때 쓰는 도구다.

## Projection 선택 기준
조회 결과를 엔티티로 받을지, 인터페이스 projection으로 받을지, DTO 생성자 projection으로 받을지는 성능과 모델 경계를 함께 봐야 한다.

- 엔티티 projection: 변경 감지와 연관관계 탐색이 필요할 때 적합하다.
- 인터페이스 projection: 선언은 간단하지만 프록시 기반이라 대량 조회에서는 비용이 커질 수 있다.
- DTO 생성자 projection: 명시적이고 빠르며 API 응답이나 읽기 모델에 적합하다.
- 동적 projection: 재사용성은 좋지만 호출부가 타입 파라미터를 이해해야 한다.

실측 사례와 비교 글들을 보면, 인터페이스 projection은 편하지만 대량 데이터에서 생성자 DTO보다 느릴 수 있다. 프록시 생성과 접근 방식의 비용이 있기 때문이다. 그래서 읽기 전용 대량 조회에서는 DTO projection이 더 안전한 선택인 경우가 많다.

## Repository 프록시와 메서드 해석
Spring Data JPA repository가 인터페이스만으로 동작하는 이유는 런타임 프록시가 메서드 시그니처를 해석해, 메서드 이름이나 `@Query` 메타데이터를 기반으로 실행 객체를 만들기 때문이다. 즉 repository 메서드는 단순 인터페이스 선언이 아니라, 프레임워크가 해석 가능한 규칙 언어라고 보는 편이 이해가 쉽다.

## 실무 기준
- 간단한 단건/목록 조회: query derivation
- 복잡한 조건 조합 또는 명시적 반환 구조: `@Query`
- 대량 읽기 모델: DTO projection 우선 검토
- 변경을 수반하는 작업 흐름: 엔티티 조회 후 도메인 로직 적용

projection은 "조회를 더 가볍게 만든다"는 이유만으로 고르면 안 된다. 반환 타입이 서비스 계층과 API 계층 경계에 어떤 영향을 주는지 같이 봐야 한다.

## 정리
Spring Data JPA의 query methods는 생산성이 높지만, 메서드 이름에 너무 많은 의미를 몰아넣으면 금방 한계가 온다. 단순하면 query derivation, 명시성이 필요하면 `@Query`, 대량 읽기라면 DTO projection이라는 기준으로 나누면 repository 인터페이스가 훨씬 읽기 쉬워진다.

## References
- [Spring Data JPA Query Methods](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html)
- [Baeldung: Spring Data JPA @Query](https://www.baeldung.com/spring-data-jpa-query)
- [Spring Data JPA는 어떻게 interface 만으로도 동작할까?](https://pingpongdev.tistory.com/25)
- [Stack Overflow: interface projection performance issue](https://stackoverflow.com/questions/53347063/why-are-interface-projections-much-slower-than-constructor-projections-and-entit)
- [How much projections can help?](https://arnoldgalovics.com/jpa-projections-comparison/)
