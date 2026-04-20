---
id: 74
title: "Open Session in View"
summary: "OSIV(Open Session in View)가 무엇이고 왜 편하지만 위험한 기본값으로 취급되는지 정리한 노트."
tags:
  - technology
  - spring
  - java
  - jpa
  - hibernate
  - osiv
created: 2026-04-20
updated: 2026-04-20
---
# Open Session in View

OSIV(Open Session in View)는 웹 요청이 끝날 때까지 Hibernate Session을 열어 두는 패턴이다.  
lazy association을 뷰나 응답 직렬화 시점까지 접근할 수 있어 편하지만, 그 편의가 성능 문제를 숨기기 쉽다.

## 한눈에 보기

- lazy loading을 요청 후반까지 가능하게 해 줌
- Spring Boot에서는 기본 활성화 경고를 볼 수 있음
- 생산성 장점이 있지만 anti-pattern로 자주 비판받음

## 왜 편한가

- 서비스 계층에서 fetch plan을 엄격히 맞추지 않아도 된다
- `LazyInitializationException`을 피하기 쉽다

즉 OSIV는 "필요한 데이터를 서비스 계층에서 다 준비하지 않아도 된다"는 편의를 제공한다. 그래서 처음에는 생산성이 좋아 보인다.

## 왜 문제인가

Vlad Mihalcea 글의 핵심은 OSIV가 `LazyInitializationException`을 가리는 band-aid라는 점이다.  
즉, 설계 문제를 해결하기보다 조회 경계를 흐리게 만든다.

대표적인 문제:

- N+1이 요청 후반에 숨어서 발생
- 트랜잭션/조회 경계가 불명확해짐
- view rendering 중 DB access가 일어날 수 있음

Baeldung 정리에서도 Spring Boot는 기본적으로 OSIV가 켜져 있고, 이를 명시적으로 끄려면:

```properties
spring.jpa.open-in-view=false
```

를 사용한다.

## 왜 특히 API 서버에서 민감한가
백엔드 API 서버에서는 응답 직렬화 중 lazy loading이 터지면, 개발자는 "컨트롤러는 단순 응답만 한다"고 생각했는데 실제로는 그 시점에도 DB 접근이 일어날 수 있다. 이게 성능 문제를 뒤늦게 드러나게 만든다.

## 실무 관점

- admin/backoffice처럼 단순하고 생산성 우선인 화면에서는 허용될 수 있음
- 외부 API/고성능 서비스에서는 꺼 두고 fetch 전략을 명시적으로 설계하는 편이 낫다
- fetch join, projection, DTO 조립으로 필요한 데이터를 서비스 계층에서 끝내는 습관이 중요하다

## 정리

OSIV는 “무조건 나쁘다”보다 **편의와 성능 통제를 맞바꾸는 기본값**으로 이해하는 게 맞다.  
lazy loading 문제를 OSIV로 덮기보다, 필요한 데이터를 서비스 계층에서 명시적으로 가져오는 방향이 더 안정적이다. 편리하지만, 성능 감시를 어렵게 만드는 기본값이다.

## References

- https://vladmihalcea.com/the-open-session-in-view-anti-pattern/
- https://www.baeldung.com/spring-open-session-in-view
