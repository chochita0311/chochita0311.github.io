---
id: 80
title: "Spring Request Mapping"
summary: "Spring request mapping이 path, method, consumes, produces 조건으로 어떻게 라우팅되는지 정리한 노트."
tags:
  - technology
  - spring
  - java
  - web
  - controller
created: 2026-04-20
updated: 2026-04-20
---
# Spring Request Mapping

Request mapping은 HTTP 요청을 어떤 컨트롤러 메서드가 처리할지 정하는 규칙이다.  
Spring에서는 path뿐 아니라 method, `consumes`, `produces` 같은 조건도 함께 사용한다.

## 한눈에 보기

- 단순 URL 매칭이 아니라 요청 조건 조합으로 라우팅
- class level과 method level mapping을 같이 본다
- media type 조건도 중요한 필터다

## 기본 관점

## 자주 보는 조건

| 조건 | 설명 |
| --- | --- |
| path | 어떤 URL 패턴인지 |
| HTTP method | GET, POST 등 |
| `consumes` | 요청 `Content-Type` 조건 |
| `produces` | 응답 media type 조건 |

공식 문서 예시처럼:

```java
@PostMapping(path = "/pets", consumes = "application/json")
public void addPet(@RequestBody Pet pet) {
}
```

처럼 선언하면 JSON 요청만 받는다.

## 왜 path만 보면 안 되나
같은 path라도 HTTP method, `consumes`, `produces`, params, headers 조건에 따라 전혀 다른 핸들러가 선택될 수 있다. 그래서 "URL이 같으니 같은 API"처럼 읽으면 실제 매핑 구조를 놓치기 쉽다.

## class level + method level
보통 컨트롤러 클래스에 공통 prefix를 두고, 메서드에 세부 매핑을 둔다. 이때 상위 조건과 하위 조건이 합쳐져 최종 라우팅 규칙이 된다. 따라서 mapping을 읽을 때는 메서드 선언 한 줄만 보지 말고 클래스 선언도 같이 봐야 한다.

## 실무 포인트

- class level `consumes`를 걸어도 method level이 override할 수 있다
- path만 보지 말고 media type 조건까지 같이 읽어야 한다
- 동일 경로라도 요청 조건 차이로 다른 메서드가 선택될 수 있다
- API 계약을 분명히 하고 싶다면 `consumes`/`produces`를 생략하지 않는 편이 좋다

## 정리

Request mapping은 컨트롤러 문법이 아니라 **요청 라우팅 규칙**이다.  
특히 `consumes`/`produces`를 같이 보면 API 계약이 더 명확해진다. path만 보고 라우팅을 이해하려 하면 실제 동작을 자주 놓치게 된다.

## References

- https://docs.spring.io/spring-framework/reference/web/webflux/controller/ann-requestmapping.html#webflux-ann-requestmapping-produces
