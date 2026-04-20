---
id: 83
title: "Spring Session with Redis"
summary: "서블릿 세션과 Spring Session의 차이, Redis 기반 세션 저장 구조, 세션 ID 전파 방식을 정리한 노트."
tags:
  - technology
  - spring
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Spring Session with Redis

## 한눈에 보기
기본 `HttpSession`은 서블릿 컨테이너가 메모리 안에서 관리한다. 그래서 단일 서버에서는 단순하지만, 다중 인스턴스 환경이나 세션 공유가 필요한 구조에서는 한계가 빨리 드러난다. Spring Session은 세션 저장소를 서블릿 컨테이너 밖으로 꺼내 Redis 같은 외부 저장소로 대체하는 방식이다.

## 왜 필요한가
기본 세션은 톰캣 같은 컨테이너 인스턴스에 묶인다. 따라서 다음 문제가 생긴다.

- 서버를 여러 대로 늘리면 세션 공유가 어렵다.
- 재배포나 장애 시 세션 유실 가능성이 크다.
- 세션 관리 정책을 애플리케이션 레벨에서 통일하기 어렵다.

Spring Session은 `HttpSession` API는 유지하면서, 실제 저장 구현만 외부 저장소로 바꿔준다.

## 세션 ID 전파
세션의 핵심은 세션 객체 자체보다 세션 ID를 어떻게 이어받느냐다. 서블릿 환경에서는 보통 `JSESSIONID` 쿠키가 브라우저와 서버 사이를 오간다. 클라이언트가 이후 요청에 같은 세션 ID를 보내면, 서버는 그 ID에 해당하는 세션 상태를 조회한다.

Spring Session을 도입해도 이 기본 흐름은 유지된다. 달라지는 건 "세션 데이터가 어디에 저장되느냐"다.

## Redis 기반 Spring Session
Redis를 저장소로 쓰면 애플리케이션 인스턴스가 여러 개여도 동일한 세션 상태를 조회할 수 있다. 그래서 무상태 인증 토큰을 쓰지 않는 레거시 로그인 시스템에서는 현실적인 확장 수단이 된다.

다만 Redis를 붙였다고 세션 문제가 모두 사라지는 것은 아니다.

- TTL 정책
- 직렬화 형식
- 세션 attribute 크기
- 로그인/로그아웃 이벤트 처리
- 보안 설정과 세션 고정 공격 대응

이런 요소를 함께 봐야 한다.

## Spring Security와의 연결
Spring Session 샘플 코드를 보면 Security 설정과 자연스럽게 결합된다. 로그인 성공 이후 세션이 외부 저장소에 유지되고, 이후 인증 컨텍스트가 세션을 통해 이어진다. 결국 Spring Session은 인증 시스템을 바꾸는 것이 아니라, 세션 저장의 물리적 위치를 바꾸는 일이다.

## `HttpSession`과 `@SessionAttribute`
둘은 역할이 다르다.

- `HttpSession`: 세션 저장소 자체를 직접 다룬다.
- `@SessionAttribute`: 컨트롤러에서 세션 값을 읽기 쉽게 꺼내는 편의 장치에 가깝다.

즉 세션 설계를 해야 할 때는 `HttpSession`과 Spring Session 저장 구조를 먼저 이해하고, `@SessionAttribute`는 그 위의 웹 계층 사용법으로 보는 편이 맞다.

## 정리
Spring Session은 세션 API를 바꾸는 기술이 아니라 세션 저장 전략을 교체하는 기술이다. 단일 서버 메모리 세션을 Redis 같은 외부 저장소로 바꾸면서, 다중 인스턴스 환경에서도 동일한 로그인 세션을 유지할 수 있게 해준다. 핵심은 세션 ID 전파와 저장소 책임을 분리해서 보는 것이다.

## References
- [Spring Session 도입기](https://zuminternet.github.io/spring-session/)
- [Servlet Http Session](https://velog.io/@hyun6ik/Servlet-Http-Session)
- [Spring Session sample SecurityConfig](https://github.com/spring-projects/spring-session/blob/main/spring-session-samples/spring-session-sample-boot-redis/src/main/java/sample/config/SecurityConfig.java)
- [서블릿 HTTP 세션의 세션 ID 등록 원리](https://velog.io/@kmw89891/%EC%84%9C%EB%B8%94%EB%A6%BF-HTTP-%EC%84%B8%EC%85%98%EC%9D%98-%EC%84%B8%EC%85%98-ID-%EB%93%B1%EB%A1%9D-%EC%9B%90%EB%A6%AC)
- [HttpSession과 `@SessionAttribute`](https://velog.io/@woply/spring-%EC%84%9C%EB%B8%94%EB%A6%BF%EC%9D%B4-%EC%A0%9C%EA%B3%B5%ED%95%98%EB%8A%94-HttpSession-%EC%8A%A4%ED%94%84%EB%A7%81%EC%9D%B4-%EC%A0%9C%EA%B3%B5%ED%95%98%EB%8A%94-SessionAttribute)
- [HttpServletRequest와 HttpSession, 세션과 로그인 로그아웃](https://kimfk567.tistory.com/19)
