---
id: 37
title: "Call by Value"
summary: "Java가 항상 call by value인 이유와 객체를 넘길 때 call by reference처럼 보이는 이유를 예제로 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Call By Value

Java는 예외 없이 call by value다. 다만 primitive와 객체에서 복사되는 "값의 종류"가 달라 보이기 때문에, 객체를 넘길 때만 마치 call by reference처럼 느껴진다.

## 핵심 구분
primitive는 실제 값이 복사된다. 반면 객체는 객체 자체가 아니라 객체를 가리키는 참조값이 복사된다. 그래서 메서드 안에서 복사된 참조를 통해 같은 객체를 수정할 수는 있지만, 호출한 쪽 변수가 가진 참조 자체를 바꾸는 것은 아니다.

즉 아래 둘을 구분해야 한다.

- 객체 내부 상태를 수정하는 것
- 파라미터 변수를 다른 객체로 재할당하는 것

첫 번째는 호출자에게도 보이지만, 두 번째는 메서드 안의 로컬 복사본에만 영향을 준다.

## primitive 예제

```java
static void change(int value) {
    value = 10;
}

int number = 1;
change(number);
System.out.println(number); // 1
```

`number`에 들어 있던 값 `1`이 복사되어 `change()`의 로컬 변수 `value`로 전달된다. 메서드 안에서 `value`를 바꿔도 호출자 쪽 `number`는 그대로다.

## 객체에서 헷갈리는 예제

```java
static void changeName(User user) {
    user.setName("changed");
}

User user = new User("before");
changeName(user);
System.out.println(user.getName()); // changed
```

이 코드는 결과만 보면 call by reference처럼 보인다. 하지만 실제로 전달된 것은 `user` 변수가 들고 있던 참조값의 복사본이다. 복사된 참조가 같은 객체를 가리키고 있으니, 그 객체 내부 상태를 바꾸면 호출자도 같은 객체를 보게 된다.

## 재할당 예제로 보면 더 분명하다

```java
static void replace(User user) {
    user = new User("new");
}

User user = new User("before");
replace(user);
System.out.println(user.getName()); // before
```

만약 Java가 call by reference였다면 호출자 쪽 `user` 자체가 새 객체를 가리키게 되어야 한다. 하지만 실제로는 메서드 안 로컬 변수만 새 객체를 가리킬 뿐이다. 이 예제가 Java가 call by value라는 점을 가장 명확하게 보여 준다.

## 왜 헷갈리나
`user.setName("A")` 같은 코드는 호출한 쪽에서도 결과가 보인다. 그래서 "참조로 넘긴 것 아닌가?"라고 느끼기 쉽다. 하지만 실제로는 같은 객체를 가리키는 참조값이 복사되었기 때문에 그 객체 상태가 바뀐 것이다.

## 실무에서 중요한 이유
이 개념이 흔들리면 메서드가 파라미터를 읽기만 하는지, 내부 상태를 변경하는지, 새 값을 계산해서 반환하는지 경계가 흐려진다. 컬렉션, DTO, 엔티티를 다루는 코드에서 부작용을 명확히 하려면 이 차이를 분명히 알아야 한다.

특히 다음 구분이 중요하다.

- 메서드가 입력 객체를 mutate하는가
- 메서드가 새 객체를 만들어 반환하는가
- 호출자가 변경 가능성을 알고 있는가

## 정리
Java는 항상 call by value다. 객체를 넘길 때만 참조값 복사 때문에 call by reference처럼 보일 뿐이다. 이걸 "같은 객체를 본다"와 "reference 방식으로 호출한다"를 구분해서 이해하는 것이 핵심이다.

## References
- [Java | Call by value, Call by reference](https://velog.io/@tilsong/Java-Call-by-value-Call-by-reference)
- [Java 의 Call by Value, Call by Reference](https://bcp0109.tistory.com/360)
