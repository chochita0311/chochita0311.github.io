---
id: 24
title: "@Modifying"
summary: Spring Data JPA에서 @Query로 update/delete를 실행할 때 @Modifying이 왜 필요한지와 persistence context 주의점을 정리한 노트.
created: 2026-04-05
updated: 2026-04-05
tags:
  - java
  - spring-data-jpa
  - modifying
  - jpa
---
# @Modifying

`@Modifying`은 Spring Data JPA에서 `@Query`로 **조회가 아닌 변경 쿼리**를 실행할 때 붙이는 어노테이션이다.

## 한눈에 보기

- JPQL/SQL `update`, `delete`, DDL 같은 변경 쿼리에 사용
- `@Query`만으로는 변경 쿼리 의도를 알릴 수 없음
- 실행 후 persistence context와 DB 상태가 어긋날 수 있어 주의 필요

## 언제 필요한가

Spring Data JPA는 기본적으로 query method, `@Query`, custom repository 구현으로 데이터를 다룬다.  
이 중 `@Query`로 변경 쿼리를 직접 작성할 때는 `@Modifying`이 필요하다.

```java
@Modifying
@Query("update User u set u.active = false where u.lastLoginDate < :date")
int deactivateUsers(LocalDate date);
```

Baeldung 정리처럼 Spring Data JPA는 이름 기반 query method나 일반 `@Query`를 주로 조회 문맥으로 해석한다. 그래서 update/delete를 명시하려면 `@Modifying`이 필요하다.

## 무엇이 달라지나
핵심은 이 쿼리가 엔티티를 하나씩 로딩해서 변경하는 것이 아니라, DB에 직접 bulk query를 날린다는 점이다. 즉 엔티티 상태를 따라가며 dirty checking 하는 방식과 완전히 다르다.

이 차이 때문에 다음이 함께 따라온다.

- 변경된 row 수를 반환할 수 있다
- 엔티티 lifecycle callback이 기대대로 동작하지 않을 수 있다
- 영속성 컨텍스트와 DB 상태가 쉽게 어긋난다

## 왜 주의해야 하나

변경 쿼리는 영속성 컨텍스트를 우회해서 DB를 직접 바꾼다.  
그래서 이미 메모리에 올라온 엔티티 상태와 DB 상태가 달라질 수 있다.

Baeldung 정리의 핵심 포인트:

- `clearAutomatically = true`로 실행 후 persistence context를 비울 수 있음
- 필요하면 flush 시점도 의식해야 함

```java
@Modifying(clearAutomatically = true)
```

또한 flush 시점도 중요하다. 아직 flush되지 않은 변경이 남아 있다면 bulk update와 섞이면서 예상과 다른 결과를 만들 수 있다. 그래서 `flushAutomatically`와 `clearAutomatically`의 의미를 같이 이해하는 편이 좋다.

## 이름 기반 delete와도 다르다
Baeldung 글에서 특히 중요한 비교는 `deleteBy...` 같은 name-derived method와 `@Modifying @Query("delete ...")`의 차이다.

- `deleteBy...`: 엔티티를 읽고 개별 삭제 흐름을 따름
- `@Modifying delete query`: DB에 직접 bulk delete 수행

이 차이 때문에 `@PreRemove` 같은 lifecycle callback 기대도 달라질 수 있다.

## 실무 포인트

- 변경된 row 수를 반환값으로 받아 영향 범위를 확인하는 편이 좋다
- 대량 업데이트는 편하지만 영속성 컨텍스트 동기화 문제를 항상 같이 본다
- 엔티티 lifecycle callback이 기대대로 안 돌 수 있다는 점도 구분해야 한다
- 서비스 로직에서 "엔티티를 수정하는가"와 "bulk query를 날리는가"를 의식적으로 나눈다

## 정리

`@Modifying`은 단순 문법보다도, **"이 쿼리는 조회가 아니라 상태 변경"** 이라는 의미를 Spring Data JPA에 명시하는 장치다.  
진짜 핵심은 쿼리 문법보다, bulk 변경이 영속성 컨텍스트와 lifecycle 모델을 우회한다는 점을 알고 쓰는 것이다.

## References

- https://www.baeldung.com/spring-data-jpa-modifying-annotation
