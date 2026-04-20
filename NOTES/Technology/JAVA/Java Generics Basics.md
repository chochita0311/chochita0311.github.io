---
id: 41
title: "Java Generics Basics"
summary: "Java generics의 기본 개념, 타입 안전성, wildcard와 type erasure까지 복습용으로 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Java Generics Basics

Generics는 자바에서 타입 안전성을 컴파일 시점으로 끌어올리는 장치다. 컬렉션에서 아무거나 꺼내 캐스팅하던 방식 대신, 애초에 어떤 타입을 기대하는지 API에 명시하게 해 준다.

## 왜 중요한가
Generics가 없으면 잘못된 타입이 컬렉션에 섞여도 런타임까지 버그가 숨어 있을 수 있다. Generics는 이런 문제를 컴파일 단계에서 드러내고, 캐스팅도 줄여 준다.

```java
List<Integer> numbers = new ArrayList<>();
numbers.add(1);
int first = numbers.get(0);
```

제네릭이 없던 raw type 시절에는 `Object`로 꺼내 캐스팅해야 했고, 잘못된 타입이 섞여도 런타임까지 버그가 숨어 있을 수 있었다.

## 자주 만나는 개념
- 타입 파라미터: `List<T>`
- bounded type: `<T extends Number>`
- wildcard: `?`, `? extends`, `? super`

실무 코드의 대부분은 이 세 가지 축으로 읽힌다.

## generic 메서드 예제

```java
public static <T> List<T> fromArray(T[] values) {
    return Arrays.asList(values);
}
```

Baeldung 예제처럼 타입 파라미터는 클래스뿐 아니라 메서드에도 둘 수 있다. API를 타입 안전하게 일반화하고 싶을 때 매우 자주 쓰인다.

## wildcard는 읽기/쓰기 방향을 구분하는 도구다
초보자가 가장 자주 헷갈리는 지점은 `? extends`와 `? super`다.

- `? extends T`: 읽기 중심
- `? super T`: 쓰기 중심

즉 숫자 계층을 읽기만 할 리스트라면 `List<? extends Number>`가 맞고, `Integer`를 넣어야 하는 소비자라면 `List<? super Integer>`가 더 적합하다.

## type erasure 때문에 생기는 제약
자바 generics는 런타임 타입 정보를 완전히 보존하지 않는다. 그래서 `new T()`, `T.class`, generic 배열 생성, 일부 reflection 사용에서 제약이 생긴다.

이게 자바 generics가 때때로 불편하게 느껴지는 가장 큰 이유다. 컴파일 단계에서는 타입 안전성을 강하게 주지만, 런타임에는 타입 정보가 지워지므로 "제네릭이면 런타임에도 타입을 안다"고 생각하면 곧바로 막히게 된다.

## enum과 함께 쓸 때
generic API에 enum을 넣으면 `values()` 같은 정적 메서드 성격 때문에 직관이 깨지는 지점이 있다. enum은 클래스처럼 보이지만 언어 차원 특수 규칙을 가지기 때문이다. 그래서 enum generic API에서는 `Class<E extends Enum<E>>`를 함께 받는 패턴이 자주 나온다.

## 실무 기준
- 컬렉션, 공통 유틸, mapper API는 generics를 적극 활용
- wildcard는 읽기/쓰기 방향을 기준으로 선택
- 런타임 타입이 꼭 필요하면 `Class<T>`를 함께 받는 설계 검토

## 정리
Generics는 문법 장식이 아니라 타입 안전성과 API 명확성을 위한 기본 도구다. 다만 컴파일 시점 안전성과 런타임 타입 정보를 같은 것으로 보면 안 되고, type erasure 제약을 같이 이해해야 한다.

## References
- [Baeldung: The Basics of Java Generics](https://www.baeldung.com/java-generics)
- [Coderanch: generic enum and the `values()` method](https://coderanch.com/t/526806/java/generic-enum-values-method)
