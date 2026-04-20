---
id: 55
title: "String.join StringBuilder Efficiency"
summary: "문자열 연결에서 `StringBuilder`, `String.join()`, `+`의 선택 기준과 반복 연결 시 비용 차이를 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# String.join vs StringBuilder Efficiency

문자열 연결은 코드가 짧아 보인다고 같은 비용을 가지는 것이 아니다. 중요한 건 연결 횟수, 반복 여부, 구분자 존재 여부다.

## 가장 흔한 세 가지 선택
- 반복문 안에서 계속 붙임: `StringBuilder`
- 컬렉션을 구분자로 합침: `String.join()`
- 짧은 정적 표현: `+`

## 왜 `StringBuilder`가 기본인가
문자열은 불변이라 반복 연결 시 중간 객체가 많이 생길 수 있다. `StringBuilder`는 이런 비용을 줄이는 가장 직접적인 방법이다.

```java
StringBuilder builder = new StringBuilder();
for (String part : parts) {
    builder.append(part);
}
String result = builder.toString();
```

Baeldung의 비교도 반복 연결 시 `StringBuilder` 계열이 훨씬 유리하다는 점을 보여 준다.

## `String.join()`이 더 좋은 경우

```java
String csv = String.join(",", parts);
```

구분자가 있고, 이미 문자열 목록이 준비돼 있다면 `String.join()`이 의도를 가장 직접적으로 보여 준다. 성능만이 아니라 "무엇을 하려는가"가 코드에 바로 드러난다는 점도 장점이다.

## `+`는 언제 괜찮나
짧고 정적인 연결은 `+`도 충분하다.

```java
String message = "Hello, " + name;
```

문제는 이것을 반복문 안에서 계속 쓰는 경우다. 그때는 문법은 짧아도 비용이 커질 수 있다.

## 실무 기준
- 반복 연결: `StringBuilder`
- 구분자 있는 목록 결합: `String.join()`
- 아주 짧은 표현: `+`

## 정리
문자열 연결은 문법 취향보다 사용 패턴이 중요하다. 반복이면 `StringBuilder`, 목록 결합이면 `String.join()`, 아주 짧은 표현만 `+`로 보는 편이 좋다.

## References
- [Baeldung: Java String Concatenation Methods](https://www.baeldung.com/java-string-concatenation-methods)
