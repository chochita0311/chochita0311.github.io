---
id: 25
title: "@NotNull @Size"
summary: "Bean Validation의 `@NotNull`, `@Size`와 JPA `@Column`이 각각 어느 레이어를 책임지는지 정리한 노트."
created: 2026-04-05
updated: 2026-04-20
tags:
  - java
  - validation
  - hibernate
  - notnull
  - size
---

# `@NotNull` and `@Size`

## 한눈에 보기
`@NotNull`과 `@Size`는 Bean Validation 규칙이고, `@Column`은 JPA 컬럼 메타데이터다. Hibernate가 일부 validation 정보를 DDL에도 반영할 수 있어서 둘이 연결돼 보이지만, 본질적으로는 같은 책임이 아니다.

## 먼저 레이어를 나눠서 봐야 한다
- `@NotNull`: 런타임 검증 규칙
- `@Size`: 문자열/컬렉션 길이 검증 규칙
- `@Column(nullable = false, length = ...)`: DB 스키마 메타데이터

참고 글이 강조하는 핵심은, Hibernate가 이 셋을 일부 연결해 줄 수 있어도 개발자가 같은 개념으로 이해하면 결국 검증과 스키마가 뒤섞인다는 점이다.

## 예제로 보면 더 명확하다

```java
@Entity
public class UserProfile {
    @NotNull
    @Size(max = 20)
    @Column(length = 20, nullable = false)
    private String nickname;
}
```

겉보기에는 모두 같은 제약처럼 보이지만 실제 의미는 다르다.

- `@NotNull`은 validator가 null 여부를 검사한다.
- `@Size(max = 20)`은 문자열 길이를 검사한다.
- `@Column(length = 20)`은 컬럼 길이를 정하는 데 쓰인다.

즉 같은 필드에 함께 붙어도 역할은 겹치지 않는다.

## 왜 `@NotNull`이 중요한가
링크 문서가 설명하듯 `@Column(nullable = false)`만 두면 실제 DB에 쿼리를 보낼 때까지 애플리케이션이 null 문제를 모를 수 있다. 반면 `@NotNull`은 영속화 전에 validation 단계에서 예외를 만들 수 있다.

```java
public class SignupRequest {
    @NotNull
    @Size(min = 2, max = 20)
    private String nickname;
}
```

DTO 수준에서 먼저 검증하면 DB round-trip 전에 잘못된 입력을 걸러낼 수 있다. 그래서 `@NotNull`은 단지 DDL 생성 보조가 아니라, 애플리케이션 검증 전략의 일부다.

## `@Size`와 컬럼 길이를 같은 의미로 보면 안 되는 이유
`@Size(max = 20)`은 사용자 입력 정책일 수 있다. 반면 DB 컬럼 길이 20은 저장소 제약이다. 두 값이 우연히 같을 수는 있어도 항상 같을 필요는 없다.

예를 들어 API 정책은 50자까지 허용하지만, DB는 현재 255자로 넓게 열어 둘 수도 있다. 반대로 DB는 50자인데, 서비스 정책은 20자까지만 허용할 수도 있다. 이때 validation과 schema는 일부러 분리해 두는 것이 오히려 자연스럽다.

## Hibernate 자동 DDL 반영은 보너스로 보는 편이 낫다
참고 글처럼 Hibernate Validator는 일부 제약을 읽어 DDL에 반영할 수 있다. 하지만 그것을 믿고 validation과 schema 설계를 한 덩어리로 생각하면, 추후 DB 변경이나 DTO 분리 시 혼란이 커진다.

실무에서는 보통 다음처럼 생각한다.

- DTO: 입력 규칙 표현
- Entity: 영속 모델 표현
- DB: 최종 무결성 보장

## 실무 기준
- null 금지와 길이 검증은 DTO에서 먼저 표현
- 엔티티에는 validation과 컬럼 메타데이터를 의도적으로 배치
- DB 무결성은 여전히 DB 제약으로 보장
- `@Size`를 곧바로 컬럼 길이 정의로 이해하지 않기

## 정리
엔티티 필드 제약은 `@NotNull`, `@Size`, `@Column`을 역할별로 나눠 쓰는 편이 안전하다. Hibernate가 일부 연결해 준다고 해서 validation과 schema가 같은 레이어가 되는 것은 아니다.

## References
- [Hibernate는 `@Column`과 `@Size` 사용 시 길이를 어떻게 판단할까](https://melonturtle.netlify.app/hibernate-column-size/)
