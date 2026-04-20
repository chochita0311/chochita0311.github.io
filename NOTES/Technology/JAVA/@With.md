---
id: 30
title: "@With"
summary: "Lombok `@With`가 불변 객체 복사-수정 패턴을 어떻게 단순화하는지와 builder와의 역할 차이를 정리한 노트."
created: 2026-04-05
updated: 2026-04-20
tags:
  - java
  - lombok
  - immutable
  - with
---

# `@With`

## 한눈에 보기
`@With`는 기존 객체를 바꾸지 않고 일부 필드만 바꾼 새 객체를 만드는 `withXxx()` 메서드를 생성한다. 불변 객체에서 복사-수정 패턴을 간단하게 만드는 데 특히 잘 맞는다.

## 예제로 보면 역할이 분명하다
설정 객체처럼 대부분은 유지하되 일부 값만 다른 복사본이 자주 필요할 때 `@With`가 유용하다.

```java
@Value
public class MailSettings {
    String host;

    @With
    int port;

    @With
    boolean tlsEnabled;
}
```

```java
MailSettings settings = new MailSettings("smtp.example.com", 25, false);
MailSettings secure = settings.withPort(587).withTlsEnabled(true);
```

원본은 그대로 두고, 바뀐 필드만 반영된 새 객체를 만든다. 그래서 setter를 허용하지 않으면서도 변경된 버전을 다루기 쉬워진다.

## 어디에 맞는가
`@Value`, `final` 필드, 전체 생성자와 함께 쓸 때 가장 자연스럽다. builder가 "처음 조립"이라면 `@With`는 "이미 있는 객체의 일부 차이"를 표현하는 데 가깝다.

## builder와의 차이
- builder: 여러 필드를 처음부터 채워 객체를 생성할 때 적합
- `@With`: 이미 만든 불변 객체를 조금 바꾼 새 복사본이 필요할 때 적합

실무에서는 둘을 함께 쓰는 경우도 많다. 초깃값은 builder로 만들고, 이후 부분 수정은 `@With`로 처리하는 방식이다.

## 언제 특히 유용한가
설정 객체, DTO, 작은 값 객체처럼 대부분 그대로 두되 일부 필드만 바뀐 복사본을 자주 만들 때 좋다. 반대로 상태 변경이 자연스러운 가변 객체라면 억지로 붙일 이유가 크지 않다.

## 주의할 점
Baeldung 예제처럼 `@With`는 static 필드에는 의미가 없고, abstract class에서는 구체 타입 복제를 자동으로 알 수 없어 제약이 있다. 또한 가변 필드를 가진 객체에 붙이면 겉으로만 불변처럼 보여 오히려 혼란을 만든다.

## 정리
불변 모델을 유지하면서 작은 변경을 자주 만들면 `@With`가 잘 맞는다. 가변 객체에 억지로 붙일 이유는 크지 않으며, builder와 경쟁시키기보다 생성 시점이 다른 도구로 이해하는 편이 좋다.

## References
- [Baeldung: Lombok Using `@With`](https://www.baeldung.com/lombok-with-annotations)
- [Lombok 정리](https://yeoooo.github.io/java/Lombok/)
- [KapreSoft: Using `@With` to Clone Immutable Objects](https://www.kapresoft.com/java/2022/08/29/lombok-cloning-immutable-objects-using-with.html)
