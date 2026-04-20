---
id: 58
title: "Void vs void"
summary: "`void`와 `Void`의 차이, 제네릭과 비동기 API에서 `Void`가 필요한 경우를 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Void vs void

`void`와 `Void`는 이름은 비슷하지만 성격이 다르다. `void`는 언어 키워드이고, `Void`는 클래스 타입이다. 일반 메서드에서는 거의 `void`만 보지만, 타입이 필요한 자리에서는 `Void`가 등장할 수 있다.

## 가장 흔한 차이

```java
public void sendEmail() {
}
```

여기서는 반환 타입 자리에 키워드 `void`가 들어간다. 반면 제네릭처럼 "타입 자리"가 필요한 경우에는 `Void`를 쓴다.

```java
CompletableFuture<Void> future = CompletableFuture.runAsync(() -> sendEmail());
```

이 코드는 결과값은 없지만, 비동기 작업의 완료 자체는 표현해야 하므로 `Void`가 필요하다.

## 어디서 `Void`가 필요한가
- 제네릭 시그니처
- reflection 결과 타입 표현
- 값은 없지만 타입 자리는 필요함을 드러낼 때

예를 들어 `CompletableFuture<Void>`는 비동기 작업은 있지만 의미 있는 반환값은 없다는 뜻을 표현한다.

## `Void`를 값처럼 다루는 경우는 드물다
Baeldung 글이 설명하듯 `Void`는 인스턴스를 만들어 적극적으로 쓰는 타입이 아니라, "여기엔 반환 타입이 없지만 타입 자리는 필요하다"는 표시 용도에 가깝다. 일반 메서드 선언에서는 대부분 `void`만으로 충분하다.

## 왜 이름이 비슷해도 구분이 중요한가
`CompletableFuture<void>` 같은 문법은 존재하지 않는다. 제네릭 타입 인자는 클래스 타입이어야 하므로, 비동기 체인이나 reflection에서는 반드시 `Void`가 필요하다. 반대로 일반 메서드 선언에 `Void`를 쓰면 오히려 불필요한 혼란을 만든다.

## 실무 기준
- 일반 메서드 반환 없음: `void`
- 제네릭, 비동기 파이프라인, reflection 메타데이터: `Void`
- `Void`를 실제 값처럼 주고받는 설계는 지양

## 기억하기 쉬운 기준
메서드 시그니처를 선언하는 자리면 대부분 `void`다. 타입 인자를 요구하는 자리면 그때 `Void`를 떠올리면 된다.

## 정리
`void`는 반환 없음, `Void`는 타입 자리에서의 반환 없음 표현이다. 둘을 같은 개념군으로 보되, 쓰이는 문맥은 다르다고 이해하면 된다.

## References
- [Baeldung: Void Type in Java](https://www.baeldung.com/java-void-type)
