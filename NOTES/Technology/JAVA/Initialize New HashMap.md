---
id: 44
title: "Initialize New HashMap"
summary: "HashMap 초기화 방식을 mutable과 immutable 관점에서 나누고 double-brace initialization을 피해야 하는 이유를 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Initialize New HashMap

HashMap 초기화는 문법 선택 문제처럼 보이지만, 실제로는 "이 맵이 이후에 바뀌는가"를 먼저 결정하는 문제다. mutable map인지 immutable map인지가 초기화 방식보다 더 중요하다.

## 가장 단순한 mutable 초기화
수정이 예정돼 있다면 가장 읽기 쉬운 방식이 보통 가장 낫다.

```java
Map<String, Integer> scores = new HashMap<>();
scores.put("kim", 95);
scores.put("lee", 88);
```

이 방식은 코드가 길어 보여도 "이 맵은 이후에도 바뀔 수 있다"는 의도가 분명하다.

## 작은 고정 값이면 immutable이 더 낫다

```java
Map<String, Integer> scores = Map.of(
    "kim", 95,
    "lee", 88
);
```

`Map.of(...)`는 고정된 설정값, 상수형 매핑, 테스트 fixture 같은 곳에서 읽기 좋고 수정 불가능하다는 의도도 바로 드러난다.

## singleton과 기존 컬렉션 API도 용도는 있다
- `Collections.singletonMap(...)`: 엔트리가 하나일 때 간단
- `Map.ofEntries(...)`: 항목이 많을 때 보기 좋음
- 생성 후 `putAll(...)`: 외부 입력을 합치거나 단계별 조립이 필요할 때

즉 중요한 것은 "한 줄로 줄이기"가 아니라 이후 변경 가능성과 용도에 맞는 표현을 고르는 것이다.

## double-brace initialization을 피하는 이유
짧아 보여도 익명 클래스가 생성되고, 예상하지 못한 숨은 참조나 불필요한 클래스 로딩이 생길 수 있다.

```java
Map<String, Integer> scores = new HashMap<>() {{
    put("kim", 95);
    put("lee", 88);
}};
```

예전 예제에서는 자주 보였지만 지금 기준으로는 좋은 기본값이 아니다. 간결함에 비해 숨은 비용이 있고, 팀원이 코드를 읽을 때도 의도가 덜 분명하다.

## 실무 기준
- 수정 예정: `new HashMap<>()` 후 명시적으로 채우기
- 작은 고정 값: `Map.of(...)`
- 값이 많고 고정: `Map.ofEntries(...)`
- double-brace: 지양

## 정리
HashMap 초기화에서 중요한 건 축약이 아니라 의도다. mutable/immutable 구분을 먼저 하고, double-brace 같은 우회 패턴은 피하는 편이 좋다.

## References
- [Baeldung: Initialize a HashMap in Java](https://www.baeldung.com/java-initialize-hashmap)
