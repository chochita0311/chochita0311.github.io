---
id: 43
title: "HashTable vs. ConcurrentHashMap"
summary: "`Hashtable`과 `ConcurrentHashMap`의 동시성 모델 차이와 실무에서 `ConcurrentHashMap`이 기본 선택이 되는 이유를 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Hashtable vs ConcurrentHashMap

둘 다 동시성 환경에서 map을 다루는 타입이지만 설계 철학이 다르다. `Hashtable`은 오래된 synchronized 컬렉션이고, `ConcurrentHashMap`은 높은 동시성과 실무 사용성을 목표로 만든 현대적인 구현이다.

## 차이의 핵심
`Hashtable`은 메서드 단위로 넓게 동기화하는 구조라 경쟁이 많아질수록 쉽게 병목이 된다. 반면 `ConcurrentHashMap`은 더 세밀한 동시성 제어와 원자 연산을 제공해 읽기/쓰기 혼합 환경에서 훨씬 유리하다.

## API 차이도 중요하다
실무에서는 잠금 방식만큼 원자 연산 API가 중요하다.

```java
ConcurrentHashMap<String, Session> sessions = new ConcurrentHashMap<>();
sessions.computeIfAbsent(userId, key -> createSession(key));
```

이 코드는 "없을 때만 생성"을 map 차원에서 원자적으로 수행한다. 반면 일반 map이나 오래된 synchronized map 패턴은 아래처럼 check-then-act 경쟁 상태를 만들기 쉽다.

```java
if (!map.containsKey(userId)) {
    map.put(userId, createSession(userId));
}
```

멀티스레드 환경에서는 두 스레드가 동시에 `containsKey()`를 통과할 수 있다. 그래서 `ConcurrentHashMap`은 단순 thread-safe map이 아니라, 동시성 패턴을 안전하게 표현하는 API를 같이 제공한다는 점이 중요하다.

## `Hashtable`이 뒤처지는 이유
- 메서드 전체를 넓게 동기화
- 동시성 친화적인 원자 조합 API가 부족
- 현대 자바 코드에서 선택할 이유가 거의 없음

즉 `Hashtable`은 "동기화된 옛날 map"에 가깝고, `ConcurrentHashMap`은 "멀티스레드에서 실제로 쓰기 좋은 map"에 가깝다.

## `ConcurrentHashMap`을 쓸 때 주의할 점
동시성 친화적이라고 해서 모든 복합 연산이 자동으로 안전해지는 것은 아니다. 여러 단계 연산을 따로 나누면 여전히 경쟁 상태가 생길 수 있다. 그래서 `compute`, `merge`, `putIfAbsent`처럼 map이 제공하는 원자 연산을 적극적으로 써야 한다.

## null 처리 차이도 실무에서 중요하다
`ConcurrentHashMap`은 `null` key와 `null` value를 허용하지 않는다. 반면 오래된 map 구현에 익숙하면 이 차이를 놓치기 쉽다. 동시성 환경에서는 "값이 없음"과 "키가 없음"을 명확히 나누는 편이 안전하기 때문에, 이 제약 자체가 오히려 장점으로 작용하기도 한다.

## 실무 기준
- 새 코드의 concurrent map 기본값: `ConcurrentHashMap`
- 레거시 `Hashtable`: 특별한 호환성 사유가 없으면 신규 사용 지양
- 캐시, 세션, in-memory registry: `computeIfAbsent` 등 원자 연산과 함께 사용

## 정리
둘 다 thread-safe처럼 보이지만 현대 자바에서는 사실상 `ConcurrentHashMap`이 기본 선택이다. `Hashtable`은 역사적으로 중요하고, `ConcurrentHashMap`은 실무적으로 중요하다.

## References
- [Baeldung: Hashtable vs ConcurrentHashMap](https://www.baeldung.com/java-hashtable-vs-concurrenthashmap)
