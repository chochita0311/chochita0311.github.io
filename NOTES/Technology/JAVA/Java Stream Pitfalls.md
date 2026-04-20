---
id: 54
title: "Java Stream Pitfalls"
summary: "Java Stream에서 `peek()` 남용과 `Collectors.toMap()` 충돌 처리처럼 자주 실수하는 지점을 예제와 함께 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Java Stream Pitfalls

Stream은 선언적으로 데이터를 다루게 해 주지만, 익숙해질수록 오히려 아무 데나 Stream을 쓰게 되는 함정도 생긴다. 이 노트에서 중요한 건 Stream 자체보다, 자주 실수하는 지점을 구분하는 것이다.

## `peek()`를 어떻게 봐야 하나
`peek()`는 디버깅과 관찰에 가깝다. 여기에 상태 변경이나 부작용 로직을 넣으면 파이프라인 의미가 흐려지고, 특히 병렬 처리나 재사용 시 의도를 파악하기 어려워진다.

```java
users.stream()
    .peek(user -> user.setActive(true))
    .toList();
```

이 코드는 동작할 수는 있지만, `peek()`를 관찰이 아니라 mutation 지점으로 쓰고 있다. Baeldung 문서가 설명하듯 `peek()`는 "흐름을 들여다보는" 용도에 더 가깝다.

## `toMap()`의 흔한 함정
`toMap()`은 키 충돌 전략을 명시하지 않으면 중복 키에서 예외가 난다. 실무에서는 이게 가장 흔한 Stream 관련 런타임 오류 중 하나다.

```java
Map<String, User> map = users.stream()
    .collect(Collectors.toMap(User::getEmail, user -> user));
```

email이 중복되면 바로 실패한다. 따라서 중복 가능성이 있으면 병합 전략을 명시해야 한다.

```java
Map<String, User> map = users.stream()
    .collect(Collectors.toMap(
        User::getEmail,
        user -> user,
        (left, right) -> left
    ));
```

## Stream을 길게 쓰는 것보다 중요한 것
다음 질문에 답이 되지 않으면 Stream 코드가 짧아도 좋은 코드가 아닐 수 있다.

- 이 파이프라인은 순수한가
- 중간 단계에 부작용이 있는가
- 수집 단계에서 충돌 전략이 분명한가
- 순서 보장이나 map 구현체 요구가 있는가

## 언제 for-loop가 더 나은가
예외 처리, 조기 종료, 복잡한 상태 변경, 성능 추적이 중요한 경우에는 for-loop가 더 읽기 쉬울 때가 많다. Stream은 선언적 변환에 강하지만, 모든 절차적 로직을 우아하게 바꾸는 도구는 아니다.

## 정리
Stream을 잘 쓰는 기준은 짧게 썼는지가 아니라, 파이프라인이 순수하고 수집 단계의 의도가 분명한가다. `peek()`와 `toMap()`은 그 차이가 가장 잘 드러나는 지점이다.

## References
- [Baeldung: Streams `peek()` API](https://www.baeldung.com/java-streams-peek-api)
- [Baeldung: Collectors `toMap()`](https://www.baeldung.com/java-collectors-tomap)
