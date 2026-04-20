---
id: 28
title: "@SuperBuilder"
summary: "상속 구조에서 Lombok `@SuperBuilder`가 해결하는 문제, 일반 `@Builder`와의 차이, 사용 한계를 정리한 노트."
created: 2026-04-05
updated: 2026-04-20
tags:
  - java
  - lombok
  - builder
  - inheritance
---

# `@SuperBuilder`

## 한눈에 보기
일반 `@Builder`는 상속 구조와 바로 잘 맞지 않는다. 부모 필드와 자식 필드를 함께 빌드해야 할 때 Lombok `@SuperBuilder`가 그 공백을 메운다.

## 일반 `@Builder`가 상속에서 불편한 이유
자식 클래스는 부모 필드까지 포함해 객체를 완성해야 하는데, 기본 `@Builder`는 계층 전체를 자연스럽게 이어주지 못한다. 그래서 생성자에 직접 `@Builder`를 붙이거나 빌더 이름을 분리하는 우회가 필요해진다.

`@SuperBuilder`는 이 문제를 줄여 자식 빌더에서 상위 클래스 속성까지 함께 채우게 해 준다.

```java
@Getter
@SuperBuilder
public class Parent {
    private final String parentName;
}

@Getter
@SuperBuilder
public class Child extends Parent {
    private final String childName;
}
```

```java
Child child = Child.builder()
    .parentName("parent")
    .childName("child")
    .build();
```

Baeldung 예제처럼 상속 계층 전체에 `@SuperBuilder`를 맞춰 두면 자식 빌더가 부모 필드도 fluent하게 받을 수 있다.

## 언제 쓰는가
상속 계층에서 생성자 인자가 누적되고, 각 계층 필드를 함께 채워야 할 때 유용하다. 다만 이 편의성은 "상속이 이미 적절하다"는 전제가 있을 때만 의미가 있다.

## `@SuperBuilder`가 해결하지 못하는 것
이 어노테이션은 상속 구조의 불편함을 줄일 뿐, 상속 모델의 타당성까지 보장하지 않는다. 빌더가 편하다고 해서 계층형 모델이 좋은 설계가 되는 것은 아니다.

특히 아래 상황에서는 다시 의심해 보는 편이 좋다.

- 상속보다 조합이 더 자연스러운 경우
- JPA 엔티티처럼 프레임워크 제약이 강한 모델
- 부모와 자식이 필드 몇 개만 공유할 뿐 의미상 다른 타입인 경우

## 자주 겪는 제약
- 계층 전체에서 `@Builder`와 `@SuperBuilder`를 섞으면 충돌하기 쉽다.
- 부모와 자식 모두 annotation 구성이 맞아야 한다.
- 생성 규칙이 복잡한 도메인 객체에서는 builder가 오히려 생성 의미를 흐릴 수 있다.

## 실무 기준
- "is-a" 관계가 분명한 상속 계층에서만 검토
- 값 조합 정도만 필요하면 상속보다 합성 우선
- 계층 전체에 builder 정책을 통일
- 프레임워크 제약이 강한 모델은 annotation 편의성보다 명시적 생성 로직 우선

## 정리
`@SuperBuilder`는 상속을 더 편하게 만드는 도구이지, 상속이 적절한지까지 보장하지는 않는다. 계층형 모델이 정말 필요한 경우에만 쓰는 편이 낫다.

## References
- [Baeldung: Lombok Builder with Inheritance](https://www.baeldung.com/lombok-builder-inheritance)
