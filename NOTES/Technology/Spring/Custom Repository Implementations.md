---
id: 63
title: "Custom Repository Implementations"
summary: "Spring Data JPA에서 기본 CRUD repository에 커스텀 동작을 붙일 때 fragment 기반으로 확장하는 방식을 정리한 노트."
tags:
  - technology
  - spring
  - java
  - spring-data-jpa
  - repository
  - extension
created: 2026-04-20
updated: 2026-04-20
---
# Custom Repository Implementations

Spring Data JPA는 단순 CRUD와 파생 쿼리만으로 끝나지 않는 경우가 많다.  
복잡한 조회, 외부 검색 연동, 저장 동작 오버라이드가 필요하면 repository에 커스텀 구현을 붙이게 된다.

## 한눈에 보기

| 항목 | 설명 |
| --- | --- |
| 목적 | 기본 repository에 직접 구현한 동작 추가 |
| 현재 권장 방식 | fragment 기반 조합 |
| 피해야 할 방식 | 예전 단일 구현체 이름 매칭에 과도하게 의존하는 방식 |
| 장점 | 재사용 가능, 여러 repository에 공통 확장 가능, Spring bean처럼 주입 가능 |

## 1. 왜 필요한가

기본 repository만으로 부족한 대표 사례:

- Querydsl이나 JPQL로도 표현이 애매한 복합 조회
- 검색 시스템, JDBC, 외부 API와 함께 동작하는 repository 계층
- 기본 `save()`나 특정 데이터 접근 정책을 공통으로 덮어쓰고 싶은 경우

이럴 때 repository를 서비스처럼 별도 분리할 수도 있지만, **repository 책임에 가까운 로직**이라면 커스텀 fragment가 자연스럽다.

## 2. 현재 권장 모델: fragment 기반 조합

Spring Data 공식 문서 기준으로 예전의 "repository 이름 + `Impl`" 패턴 기반 단일 구현체 탐지는 이제 권장되지 않는다.  
대신 **fragment 기반 programming model**을 쓰는 쪽이 권장된다.

예시는 이런 구조다.

```java
interface UserRepository extends CrudRepository<User, Long>, CustomizedUserRepository {
}
```

```java
class CustomizedUserRepositoryImpl implements CustomizedUserRepository {
    // custom implementation
}
```

핵심은 repository가 하나의 구현체가 아니라, **기본 repository + 추가 fragment들의 조합**으로 구성된다는 점이다.

## 3. fragment 방식의 장점

| 장점 | 설명 |
| --- | --- |
| 재사용 | 같은 fragment를 여러 repository가 함께 사용할 수 있음 |
| 조합성 | CRUD, Querydsl, custom behavior를 함께 합칠 수 있음 |
| Spring 친화성 | 구현체가 일반 Spring bean처럼 DI, AOP 적용 가능 |
| 우선순위 | custom fragment가 base behavior를 덮어쓸 여지가 있음 |

공식 문서에서도 custom implementation은 Spring Data 자체에 의존하지 않는 일반 Spring bean일 수 있다고 본다.  
즉, `JdbcTemplate`, 외부 검색 서비스, 다른 bean을 주입받아 써도 된다.

## 4. 여러 repository에서 공통으로 쓰기

fragment 방식의 장점은 한 repository 전용 구현에 그치지 않는다는 점이다.

예를 들어 공통 저장 정책을 만들 수도 있다.

```java
interface CustomizedSave<T> {
    <S extends T> S save(S entity);
}
```

이걸 여러 repository가 같이 확장하면, 저장 전처리나 공통 정책을 한 군데에서 재사용할 수 있다.

## 5. 주의할 점

- 예전 단일 커스텀 구현 naming pattern은 오래된 관성으로만 쓰지 않는 편이 낫다.
- fragment 이름과 구현 클래스 postfix 규칙은 지켜야 자동 감지가 자연스럽다.
- 커스텀 구현이 많아지면 repository 책임이 비대해질 수 있으니 범위를 조절해야 한다.
- business rule이 강한 로직은 repository fragment보다 service가 더 적절할 수 있다.

## 6. 정리

Spring Data JPA에서 커스텀 repository 구현의 핵심은 "기본 repository를 버리고 직접 구현한다"가 아니라, **필요한 기능 조각을 fragment로 덧붙이는 것**이다.

즉:

1. 기본 CRUD는 기본 repository에 맡기고
2. 커스텀 데이터 접근 로직만 fragment로 분리하고
3. 공통 확장은 여러 repository에서 재사용

하는 방향이 가장 유지보수에 유리하다.

## References

- https://docs.spring.io/spring-data/jpa/reference/repositories/custom-implementations.html
