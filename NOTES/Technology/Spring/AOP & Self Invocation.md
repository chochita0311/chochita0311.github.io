---
id: 32
title: "AOP & Self Invocation"
summary: Spring AOP가 프록시 기반으로 동작하기 때문에 self invocation에서 왜 빠지는지 정리한 노트.
created: 2026-04-05
updated: 2026-04-05
tags:
  - java
  - spring
  - aop
  - transaction
  - self-invocation
---
# AOP & Self Invocation

Spring의 `@Transactional`, `@Async`, 여러 AOP 어노테이션은 대부분 프록시 기반으로 동작한다.  
그래서 같은 클래스 내부에서 자기 메서드를 호출하는 self invocation에서는 기대한 AOP가 적용되지 않는 경우가 많다.

## 핵심

- Spring AOP는 외부에서 프록시를 거쳐 들어오는 호출을 가로챈다
- `this.someMethod()`는 프록시를 우회한다
- 그래서 self invocation이면 `@Transactional`, `@Async` 등이 안 먹을 수 있다

## 1. 왜 이런 일이 생기나

Tecoble 정리처럼 Spring AOP는 proxy 기반이다.  
즉, 타깃 객체 내부 호출은 proxy가 끼어들 기회가 없다.

```java
public void init() {
    this.progress();
}

@Transactional
public void progress() {
}
```

위 구조에서는 `progress()`가 public이어도 내부 호출이면 트랜잭션이 적용되지 않을 수 있다.

## 2. 접근 제한자도 영향이 있다

proxy 방식 특성상 private/protected 메서드는 더 주의해야 한다.  
특히 트랜잭션이나 AOP는 “메서드에 어노테이션을 붙였는가”보다 **프록시가 그 호출을 볼 수 있는가**가 더 중요하다.

## 3. 어떻게 풀까

실무에서 가장 무난한 해결은:

- AOP가 필요한 메서드를 다른 bean으로 분리
- 외부 호출 경계에서 AOP가 적용되게 설계

다른 방법으로 `AopContext.currentProxy()`나 AspectJ weaving이 있지만, 보통은 구조 분리가 더 읽기 쉽다.

## 4. 트랜잭션과 repository에 대한 감각

기존 메모대로 단순 조회는 트랜잭션 없이도 동작할 수 있다.  
하지만 그게 “트랜잭션 경계가 중요하지 않다”는 뜻은 아니다.

핵심은:

- 읽기 전용 조회 경계
- 변경 작업 경계
- 프록시를 통과하는 호출 경계

를 구분하는 것이다.

## 5. 정리

AOP & self invocation 노트의 핵심은 “왜 어노테이션을 붙였는데 안 먹지?”에 대한 답이다.  
답은 대부분 프록시 경계를 우회했기 때문이다.

## References

- https://tecoble.techcourse.co.kr/post/2022-11-07-transaction-aop-fact-and-misconception/
- https://dzone.com/articles/spring-beans-self-invocation-problem
- https://jiwondev.tistory.com/154
- https://www.inflearn.com/questions/272147/repository%EC%9D%80-%ED%8A%B8%EB%9E%9C%EC%A0%9D%EC%85%98%EC%9D%B4-%EA%B8%B0%EB%B3%B8%EC%9D%B8%EA%B0%80%EC%9A%94
