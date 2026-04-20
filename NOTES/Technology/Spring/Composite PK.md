---
id: 62
title: "Composite PK"
summary: "JPA에서 복합 기본 키를 모델링할 때 @IdClass와 @EmbeddedId를 어떻게 비교해야 하는지 정리한 노트."
tags:
  - technology
  - spring
  - java
  - jpa
  - primary-key
  - entity-design
created: 2026-04-20
updated: 2026-04-20
---
# Composite PK

복합 기본 키는 두 개 이상의 컬럼을 합쳐서 하나의 식별자로 쓰는 경우다.  
JPA에서는 주로 `@IdClass`와 `@EmbeddedId` 두 방식으로 표현한다.

## 한눈에 보기

| 항목 | 설명 |
| --- | --- |
| 목적 | 여러 컬럼 조합으로 엔티티 식별 |
| 대표 방식 | `@IdClass`, `@EmbeddedId` |
| 잘 맞는 경우 | 레거시 스키마, 자연 키, 다대다 연결 테이블 성격의 모델 |
| 주의점 | equals/hashCode, 식별자 클래스 설계, 조회/매핑 가독성 |

## 1. 언제 보게 되나

보통은 단일 surrogate key를 더 많이 쓰지만, 아래 상황에서는 복합 키가 남는다.

- 기존 레거시 테이블이 이미 복합 키로 설계된 경우
- 의미 있는 자연 키 조합을 그대로 유지해야 하는 경우
- 연결 테이블 성격이 강한 엔티티에서 키 자체가 조합인 경우

## 2. JPA에서의 두 가지 방식

Baeldung 정리 기준으로 JPA는 두 방식을 제공한다.

### 2-1. `@IdClass`

식별자 클래스를 별도로 만들고, 엔티티 필드에도 같은 키 컬럼을 다시 선언하는 방식이다.

```java
@Entity
@IdClass(AccountId.class)
public class Account {
    @Id
    private String accountNumber;

    @Id
    private String accountType;
}
```

특징:

- 엔티티에서 키 필드를 바로 드러내기 쉽다
- 대신 키 필드를 식별자 클래스와 엔티티에 중복 선언한다

### 2-2. `@EmbeddedId`

식별자 클래스를 `@Embeddable`로 만들고, 엔티티에서는 그 값을 하나의 임베디드 키로 감싼다.

```java
@Embeddable
public class BookId implements Serializable {
    private String title;
    private String language;
}

@Entity
public class Book {
    @EmbeddedId
    private BookId bookId;
}
```

특징:

- 키를 하나의 값 객체처럼 묶어 표현할 수 있다
- 엔티티가 조금 더 구조적으로 보일 수 있다

## 3. 공통 규칙

복합 키 클래스는 몇 가지 조건을 만족해야 한다.

- `public`이어야 함
- 기본 생성자가 있어야 함
- `Serializable`이어야 함
- `equals()`와 `hashCode()`를 구현해야 함

이 부분을 놓치면 매핑은 얼추 되어 보여도 런타임에서 문제가 생기기 쉽다.

## 4. 어떤 방식을 고를까

| 기준 | `@IdClass` | `@EmbeddedId` |
| --- | --- | --- |
| 키 필드 접근 | 엔티티 필드로 바로 접근 | 임베디드 객체를 한 번 거침 |
| 표현 방식 | 키가 엔티티에 펼쳐짐 | 키를 하나의 값으로 묶음 |
| 중복 선언 | 있음 | 상대적으로 적음 |
| 읽는 느낌 | 단순하고 직접적 | 구조적이고 값 객체 친화적 |

실무적으로는:

- 키 필드를 바로 드러내고 싶으면 `@IdClass`
- 키를 하나의 도메인 값처럼 묶고 싶으면 `@EmbeddedId`

정도로 보면 된다.

## 5. 주의할 점

- 복합 키는 조회 메서드 시그니처와 코드 가독성을 복잡하게 만들 수 있다.
- 연관관계까지 섞이면 매핑이 금방 어려워진다.
- 새 스키마를 설계하는 입장이라면 정말 복합 키가 필요한지 먼저 의심하는 편이 좋다.

즉, 복합 키는 "지원되는 기능"이지만, 항상 좋은 기본값은 아니다.

## 6. 정리

JPA에서 복합 키를 다뤄야 한다면 핵심은 `@IdClass`와 `@EmbeddedId` 중 무엇이 더 예쁜지가 아니라:

1. 현재 스키마 제약을 얼마나 잘 반영하는지
2. 키를 필드 집합으로 볼지 값 객체로 볼지
3. 이후 조회/연관관계 코드가 얼마나 복잡해질지

를 같이 보는 것이다.

## References

- https://www.baeldung.com/jpa-composite-primary-keys
