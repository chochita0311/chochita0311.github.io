---
id: technology-java-abstract-class-di
title: "abstract class DI"
summary: References and example code for applying Spring dependency injection patterns inside abstract classes.
published: 2026-04-05
tags:
  - java
  - spring
  - dependency-injection
  - abstract-class
---

- [baeldung: spring-autowired-abstract-class](https://www.baeldung.com/spring-autowired-abstract-class)
- [Use Spring’s Dependency Injection in Java abstract class](https://medium.com/@citizenACLV/use-springs-dependency-injection-in-java-abstract-class-2573c1b4c0d1)
    - [code source](https://gitlab.com/Lovegiver/springandabstractclass/-/blob/master/AnnotateAbstract-2/src/main/java/com/citizenweb/training/classes/AbstractMyClass.java?ref_type=heads)
```java
package com.citizenweb.training.classes;
import org.springframework.beans.factory.annotation.Autowired;
import com.citizenweb.training.interfaces.IMyService;
public abstract class AbstractMyClass {
	
	@Autowired
	private IMyService serv;
	
	private String name;
	
	protected AbstractMyClass() {}
	
	public AbstractMyClass(String name) {
		this.name = name;
	}
	public String getName() {
		return name;
	}
	public AbstractMyClass setName(String name) {
		this.name = name;
		return this;
	}
	
	public abstract void doAction();
	
	public void doElsething(String whichClass) {
		System.out.println("My Abstract class action lauched by " + whichClass);
		serv.doSomething();
		System.out.println("End of Abstract action");
	}
	
}
```
