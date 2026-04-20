---
id: 56
title: "Java Switch and Pattern Matching"
summary: "전통적인 switch가 switch expression과 pattern matching으로 확장된 흐름과 실무 주의점을 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Java Switch and Pattern Matching

Java의 switch는 예전의 단순 분기문에서 expression과 pattern matching을 지원하는 현대적 문법으로 확장됐다. 그래서 지금은 단순 상수 비교뿐 아니라, 더 선언적으로 분기 로직을 표현하는 도구로 보는 편이 맞다.

## 먼저 switch expression이 바꾼 점

```java
String label = switch (status) {
    case READY -> "ready";
    case RUNNING -> "running";
    default -> "unknown";
};
```

이 문법 덕분에 `switch`가 단순 흐름 제어문이 아니라 값을 만드는 expression으로도 자연스럽게 쓰이게 됐다. fall-through를 기본으로 걱정하던 옛 switch보다 훨씬 읽기 쉽다.

## 바뀐 핵심
- 화살표 문법
- switch expression
- `yield`
- type pattern
- `case null`

이 변화 덕분에 길고 반복적인 `if-else` 체인을 더 읽기 좋은 구조로 바꿀 수 있다.

## pattern matching 예제

```java
static String describe(Object value) {
    return switch (value) {
        case null -> "null";
        case String s -> "string: " + s;
        case Integer i -> "int: " + i;
        default -> "other";
    };
}
```

이제 타입 검사와 캐스팅을 분리하지 않고 한 case 안에서 바로 표현할 수 있다. Java 21 패턴 매칭 글이 보여 주듯, 타입 분기가 많은 코드에서는 가독성이 확실히 좋아진다.

## pattern matching에서 주의할 점
타입 패턴은 강력하지만 case 순서가 중요하다. 더 넓은 타입을 먼저 두면 뒤의 더 구체적인 case가 unreachable이 될 수 있다. null 처리도 예전 switch 직관과 다를 수 있어서 명시적으로 보는 편이 안전하다.

또한 switch가 길어질수록 "모든 분기 규칙을 한곳에 몰아넣는 것"이 항상 좋은지 다시 봐야 한다. 타입별 행위가 계속 늘어나면 다형성이 더 적절한 경우도 있다.

## 실무 기준
- enum, 상태 코드, 작은 타입 분기: switch expression 적극 사용
- 타입 패턴 분기: 순서와 null 처리 명시
- 분기 수가 너무 많아지면 다형성이나 전략 객체도 검토

## 정리
최신 switch는 단순 문법 개선이 아니라 분기 로직을 더 선언적으로 쓰는 방식으로 진화한 것이다. 다만 pattern matching까지 쓸 때는 순서와 dominance 규칙을 같이 이해해야 한다.

## References
- [Baeldung: Java Switch Statement](https://www.baeldung.com/java-switch)
- [Looking at Java 21: Switch Pattern Matching](https://belief-driven-design.com/looking-at-java-21-switch-pattern-matching-14648/)
- [GeeksforGeeks: Switch Statements in Java](https://www.geeksforgeeks.org/java/switch-statement-in-java/)
