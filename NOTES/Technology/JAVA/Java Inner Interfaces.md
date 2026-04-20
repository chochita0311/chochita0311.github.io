---
id: 45
title: "Java Inner Interfaces"
summary: "Java 내부 인터페이스가 캡슐화와 API 경계 표현에 어떻게 쓰이는지와 언제 top-level 타입으로 분리해야 하는지 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Java Inner Interfaces

내부 인터페이스는 특정 타입 안에서만 의미 있는 계약을 소유 타입 가까이에 둘 수 있게 해 준다. 핵심은 "이 인터페이스가 전역 개념이 아니라, 이 클래스나 타입의 문맥 안에서만 의미가 있다"는 점을 구조로 드러내는 것이다.

## 어디에 잘 맞나
- 내부 콜백
- 제한된 전략 인터페이스
- 특정 타입이 제공하는 확장 포인트

이런 경우에는 top-level 인터페이스로 분리하는 것보다 내부에 두는 편이 더 응집력이 있다.

```java
public class JobRunner {
    interface Callback {
        void onComplete(String result);
    }

    public void run(Callback callback) {
        callback.onComplete("done");
    }
}
```

위 인터페이스는 `JobRunner` 문맥 안에서만 의미가 있다. 이런 계약을 굳이 패키지 전역 타입으로 꺼내면 오히려 범위가 넓어 보일 수 있다.

## 언제 분리해야 하나
반대로 여러 패키지에서 재사용되거나, 특정 클래스와 독립된 도메인 의미를 가지기 시작하면 별도 top-level 타입이 더 자연스럽다. 내부 인터페이스는 가까운 문맥에는 좋지만, 재사용 범위가 넓어질수록 결합을 숨기는 방향으로 작용할 수 있다.

예를 들어 결제 시스템 전반에서 쓰는 `PaymentGateway` 계약을 어떤 한 클래스 안에 넣어 두는 것은 오히려 문맥을 잘못 표현하는 셈이다.

## 접근 제어도 같이 생각해야 한다
내부 인터페이스는 public, protected, private 범위를 통해 노출 수준을 세밀하게 조절하기 좋다. 그래서 "확장 포인트는 있지만 외부 전역 개념은 아님"을 표현할 때 특히 유용하다.

## 과하게 중첩하면 생기는 문제
내부 인터페이스가 많아질수록 타입 이름이 길어지고 탐색성이 떨어질 수 있다. 그래서 응집도를 높인다는 이유로 무조건 중첩하는 것은 오히려 역효과다. "이 계약을 이 타입 밖에서 독립적으로 생각할 수 있는가"를 기준으로 분리 여부를 판단하는 편이 좋다.

## 실무 기준
- 특정 클래스에 강하게 귀속된 콜백/전략: inner interface
- 여러 모듈이 공유하는 계약: top-level interface
- 라이브러리 공개 API: 불필요한 중첩보다 명시적 분리 우선

## 정리
내부 인터페이스는 "작고 가까운 계약"을 표현할 때 좋다. 하지만 범용 계약까지 내부에 넣으면 구조가 답답해지므로, 범위가 넓어질 때는 분리하는 편이 맞다.

## References
- [Baeldung: A Guide to Inner Interfaces in Java](https://www.baeldung.com/java-inner-interfaces)
