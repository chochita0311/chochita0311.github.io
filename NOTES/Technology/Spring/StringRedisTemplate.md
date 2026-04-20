---
id: 84
title: "StringRedisTemplate"
summary: "Spring에서 Redis를 문자열 중심으로 다룰 때 StringRedisTemplate을 어떻게 보는지 정리한 노트."
tags:
  - technology
  - spring
  - java
  - redis
  - template
created: 2026-04-20
updated: 2026-04-20
---
# StringRedisTemplate

`StringRedisTemplate`은 Redis key와 value를 문자열 기준으로 다루는 Spring의 템플릿이다.

## 한눈에 보기
- 기본 특징: key/value를 문자열 serializer 기준으로 다룸
- 잘 맞는 곳: 캐시 키, 토큰, 간단한 플래그 값, 짧은 JSON payload
- 장점: 직렬화 복잡도를 낮춤
- 같이 보는 것: TTL, serializer, connection factory

## 언제 쓰나

- 캐시 키/값을 문자열로 다룰 때
- 직렬화 문제를 최소화하고 싶을 때
- Redis 자료구조를 비교적 직접적으로 다루고 싶을 때

## 특징

- 기본 `RedisTemplate`보다 문자열 사용에 초점이 맞춰져 있다
- serializer를 단순하게 가져가기 좋다
- Lettuce/Jedis 같은 클라이언트 설정과 함께 본다

Spring Data Redis 문서에서도 `RedisTemplate` 계열은 serializer 정책이 중요하다는 점을 전제로 설명한다. `StringRedisTemplate`은 이걸 문자열 기준으로 좁혀서 더 단순하게 쓰게 해 주는 선택지다.

## 실무 포인트

- 값 구조가 복잡해지면 JSON 직렬화 정책을 명확히 해야 한다
- TTL, connection factory, serializer 조합을 같이 본다
- 단순 캐시/토큰 저장에는 부담이 적은 편이다

```java
stringRedisTemplate.opsForValue().set("token:user:1", token, Duration.ofMinutes(30));
String cached = stringRedisTemplate.opsForValue().get("token:user:1");
```

이처럼 문자열 key/value를 직접 다루는 코드가 자연스럽다. 복잡한 객체를 그대로 넣기 시작하면 `RedisTemplate` 또는 명시적 직렬화 정책을 다시 검토하는 편이 낫다.

## 언제 `RedisTemplate`보다 이쪽이 나은가
복잡한 객체 직렬화를 깊게 다루지 않고, key-value를 문자열 기준으로 명확하게 운용하고 싶을 때 더 단순하다. 특히 캐시 키, 토큰, 짧은 플래그 값처럼 문자열 중심 모델에서는 오히려 이쪽이 더 예측 가능하다.

반대로 객체를 그대로 넣고 꺼내는 패턴이 늘어나면 serializer 선택과 호환성 문제가 다시 커진다. 그 시점에는 템플릿 선택보다 저장 모델 자체를 다시 보는 편이 맞다.

## 정리

`StringRedisTemplate`은 Redis를 빠르게 붙일 때 가장 다루기 쉬운 선택지 중 하나다. 복잡한 객체 저장보다 문자열 기반 key-value 운용에 잘 맞고, serializer 정책을 단순화하고 싶을 때 특히 유리하다.

작게 시작하기엔 아주 좋지만, 저장 모델이 복잡해지면 템플릿보다 데이터 표현 방식을 먼저 다시 봐야 한다.

## References

- https://jronin.tistory.com/126
