---
id: 53
title: "Stream vs For Loop"
summary: "Stream과 for-loop를 성능, 가독성, 디버깅 관점에서 어떻게 나눠 볼지 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Stream vs For Loop

for-loop와 Stream은 경쟁 관계처럼 보이지만, 실제로는 반복을 어떤 스타일로 표현할 것인가의 차이에 가깝다. 성능 차이도 있지만, 대부분은 코드 의도와 조합성 차이가 더 중요하다.

## 두 스타일의 차이

```java
List<String> names = new ArrayList<>();
for (User user : users) {
    if (user.isActive()) {
        names.add(user.getName());
    }
}
```

```java
List<String> names = users.stream()
    .filter(User::isActive)
    .map(User::getName)
    .toList();
```

둘 다 같은 결과를 만들 수 있다. 차이는 "절차를 따라가며 읽는가"와 "변환 파이프라인으로 읽는가"에 있다.

## for-loop가 강한 곳
- 단순하고 직접적인 반복
- 인덱스 제어 필요
- 성능이 민감한 뜨거운 루프
- 단계별 디버깅이 중요할 때

for-loop는 가장 예측 가능하고 디버깅도 쉽다.

## Stream이 강한 곳
- filter-map-collect 같은 데이터 변환 파이프라인
- 조건 조합이 많은 읽기 로직
- 선언적으로 흐름을 보여 주고 싶을 때

즉 반복보다 변환 파이프라인이 본질일 때 Stream이 더 읽기 좋다.

## 성능만으로 결론 내리면 안 되는 이유
링크 글처럼 Stream이 for-loop보다 느릴 수는 있다. 하지만 모든 반복이 성능 병목인 것은 아니다. 반대로 Stream이 더 읽기 쉬운 변환 로직이라면, 미세한 비용보다 유지보수 이점이 더 클 수 있다.

## 실무 기준
- hot path, 복잡한 예외 처리, 조기 종료: for-loop 우선
- 변환 파이프라인과 선언적 읽기: Stream 우선
- 애매하면 팀이 더 빨리 읽고 수정할 수 있는 쪽 선택

## 정리
성능이 절대 기준은 아니다. 뜨거운 루프면 for-loop, 데이터 변환 의도를 보여 주려면 Stream이라는 기준이 실무적으로 가장 무난하다.

## References
- [Java Stream API는 왜 for-loop보다 느릴까?](https://sigridjin.medium.com/java-stream-api%EB%8A%94-%EC%99%9C-for-loop%EB%B3%B4%EB%8B%A4-%EB%8A%90%EB%A6%B4%EA%B9%8C-50dec4b9974b)
