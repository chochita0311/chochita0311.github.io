---
id: 85
title: "Swagger and springdoc"
summary: "Spring Boot에서 Swagger/OpenAPI 문서를 springdoc으로 붙일 때 핵심 의존성과 용도를 정리한 노트."
tags:
  - technology
  - spring
  - java
  - openapi
  - swagger
created: 2026-04-20
updated: 2026-04-20
---
# Swagger and springdoc

Spring Boot에서 Swagger라고 부르는 건 보통 OpenAPI 문서와 Swagger UI를 붙이는 작업이다.  
현재 Spring 생태계에서는 `springdoc-openapi`를 기준으로 보는 편이 자연스럽다.

## 핵심

- Spring MVC/WebFlux에서 OpenAPI 문서를 자동 노출
- Swagger UI로 API 문서를 브라우저에서 확인 가능
- Springfox에서 springdoc으로 넘어오는 경우가 많음

## 기본 의존성

springdoc 공식 문서 기준으로 Web MVC에서 UI까지 쓰려면:

```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>2.8.17</version>
</dependency>
```

WebFlux면 대응 starter를 쓴다.

## 붙이고 나면 보통 어디서 보나
springdoc는 OpenAPI 스펙과 Swagger UI를 함께 노출한다. 그래서 팀에서는 보통 다음 두 용도로 쓴다.

- 컨트롤러 계약을 빠르게 탐색
- 프론트엔드나 외부 소비자와 응답 구조를 맞춤

즉 Swagger UI는 테스트 대체물이 아니라, 계약을 눈으로 확인하는 탐색 인터페이스에 가깝다.

## 언제 유용한가

- 내부 API를 빠르게 탐색할 때
- 프론트엔드/백엔드 협업 문서를 자동화할 때
- 컨트롤러 변경과 문서 노출을 함께 가져가고 싶을 때

## 실무 포인트

- Swagger는 테스트 도구라기보다 문서/탐색 도구다
- 보안이 필요한 환경에서는 공개 범위를 분리해야 한다
- Springfox를 쓰고 있다면 migration 포인트를 따로 보는 편이 좋다

또한 운영 환경에서 그대로 외부 공개하지 않고, 내부망이나 인증 뒤에서만 열도록 제어하는 경우가 많다.

## 정리

Spring에서 Swagger 노트는 사실상 **springdoc 기반 OpenAPI 문서화**로 이해하면 된다.  
의존성 선택, 노출 범위, 운영 환경 접근 제어를 같이 봐야 한다.

## References

- https://springdoc.org/#Introduction
