# 第一章 数据库的概述
#### 表，记录，字段
- E-R（entity-relationship,实体-联系）模型中有三个主要的概念：实体集，属性，联系集
- 一个实体集（class），对应于数据库中的一个表（table），一个实体（instance）则对应于数据库表中的一行（row），也成为一条记录（record）。一个属性（attribute）对应于数据库表中的一列（column），也称之为一个字段（field）。
![[Pasted image 20241027212129.png|300]]
```
ORM思想 (Object Relational Mapping)体现：
数据库中的一个表 <---> Java或Python中的一个类
表中的一条数据 <---> 类中的一个对象（或实体）
表中的一个列 <----> 类中的一个字段、属性(field)
```
#### 表的关联关系
表与表之间的数据记录有四种：
**1. 一对一关联**
实际开发中应用不多，因为一对一可以创建成一张表
例：设计表：学号，姓名，手机号，班级，系别，身份证，住址，籍贯，联系人
拆分为两个表：两个表的记录是一一对应关系
- 基础信息：学号，姓名，手机号，班级，系别
- 档案信息：学号，身份证，住址，籍贯，联系人
==两种建表原则==：
- ==外键唯一：主表的主键和从表的外键（唯一），形成主外键关系，外键唯一。==
- ==外键是主键：主表的主键和从表的主键，形成主外键关系。==![[Pasted image 20241027205023.png|300]]
**2. 一对多关系**
- 举例：客户表和订单表，分类表和商品表，部门表和员工表
	- 员工表：编号，姓名，所属部门
	- 部门表：编号，名称，简介
- ==一对多建表原则==：==在从表（多方）创建一个字段，字段作为外键指向主表（一方）的主键==![[Pasted image 20241027205108.png|300]]![[Pasted image 20241027205128.png|300]]
**3. 多对多的关系**
- 要表示多对多关系，==必须创建第三个表==，该表通常称为**链接表**，他将多对多关系划分为两个一对多关系。将这两个表的主键都插入到第三个表中。![[Pasted image 20241027205246.png|300]]
- 举例：学生-课程
  - 学生信息表：一行代表一个学生的信息（学号，姓名，手机号码，班级，系别）
  - 课程信息表：一行代表一个课程的信息（课程编号，授课老师，简介...）
  - 选课信息表：一个学生可以选多门课，一门课可以被多个学生选择
```
学号      课程编号
1           1001
2           1001
1           1002
```
- 举例：产品-订单
  “订单”表和“产品”表有一种多对多的关系，这种关系是通过与“订单明细”表简历两个一对多关系来定义的。一个订单可以有多个产品，每个产品可以出现在多个订单中。
  - 产品表：“产品”表中的每条记录表示一个产品
  - 订单表：“订单”表中每条记录表示一个订单
  - 订单明细表：==每个产品可以与“订单”表中的多条记录对应，即出现在多个订单中。一个订单可以与“产品”表中的多条记录对应，即包含多个产品==![[Pasted image 20241027205921.png]]
- 举例：用户-角色
- 多对多建表原则：==需要创建第三张表，中间表中至少两个字段，这两个字段分别作为外键指向各自一方的主键==![[Pasted image 20241027211054.png|300]]
**4. 自我引用**
表内的自我引用
![[Pasted image 20241027211741.png|300]]
# 第二章 数据库环境搭建
[数据库环境搭建](D:\User\桌面\MySQL\第02章_MySQL环境搭建.pdf)
# 第三章 基本的SELECT语句
#### 1.SQL分类
SQL语言在功能上主要分入三大类：
- <font color="yellow">DDL (Data Definition Languages,数据定义语言)</font>，这些语句定义了不同的数据库，表，视图，索引等数据库对象，还可以用来创建，删除，修改数据库和数据表的结构。
  - 主要的语句关键字包括<font color="yellow">CREATE DROP ALTER</font>等。
- <font color="yellow">DML (Data Manipulation Language 数据操作语言)</font>，用于添加，删除，更新查询数据库记录，并且检查数据完整性。
  - 主要语句关键字包括<font color="yellow">INSERT DELETE UPDATE SELECT</font>等。
  - <font color="yellow">SELECT是SQL语言的基础，最为重要</font>
- <font color="yellow">DCL （Data Control Language 数据控制语言）</font>，用于定义数据库，表，字段，用户的访问权限和安全级别。
  - 主要的语句关键字包括<font color="yellow">GRANT REVOKE COMMIT ROLLBACK SAVEPOINT</font>等。
 ```
 因为查询语句使用的非常频繁，所以很多人把查询语句单独拎出来：DQL（数据查询语言）。
 还有单独将COMMIT ROLLBACK取出来称之为TCL（Transaction Control Language 事务控制语言）。
```
#### 2.SQL大小写规范
MySQL 在 Windows 环境下是大小写不敏感的
MySQL 在 Linux 环境下是大小写敏感的

推荐采用统一的书写规范：
数据库名、表名、表别名、字段名、字段别名等都小写
SQL 关键字、函数名、绑定变量等都大写
#### 3.注释
```
单行注释：#注释文字(MySQL特有的方式)
单行注释：-- 注释文字(--后面必须包含一个空格。)
多行注释：/* 注释文字 */
```
#### 4.数据指令导入
`source d:\mysqldb.sql`
#### 5.基本的SELECT语句
**SELECT**
```
SELECT 1;没有任何子句
SELECT 9/2;#没有任何子句
```
**SELECT...FORM**
```
SELECT 标识选择哪些列
FROM 标识从哪个表中选择
```
选择全部列
```
SElECT * FROM departments;  一般情况下我们不使用SELECT*
```
选择特定的列
```
SELECT department_id, location_id
FROM departments;
```
#### 6.列的别名
可以使用as 或者不使用
```
SELECT last_name AS name, commission_pct comm
FROM employees;
空格应该添加双引号
SELECT last_name "Name", salary*12 "Annual Salary"
FROM employees;
```
#### 7.去除重复行
DISTINCT
默认情况下，查询会返回全部行，包括重复行
```
SELECT DISTINCT department_id 
FROM employees;
```
有两点需要注意
1. DISTINCT 需要放到所有列名的前面，如果写成 SELECT salary, DISTINCT department_id
FROM employees 会报错。
1. DISTINCT 其实是对后面所有列名的组合进行去重，你能看到最后的结果是 74 条，因为这 74 个部门id不同，都有 salary 这个属性值。如果你想要看都有哪些不同的部门（department_id），只需要写 DISTINCT department_id 即可，后面不需要再加其他的列名了。
   
#### 8.空值运算符
- 所有运算符或者列值遇到null值，运算结果都为null
```sql
select employee_id,salary,commission_pct,
12 * salary * (1 + commission_pct) "annual_sal"
from employees;
```
MySQL里面，空值不等于空字符串。一个空字符串的长度是0，空值长度是空，空占用空间
#### 9.着重号
错误的
```sql
mysql> SELECT * FROM ORDER;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that
corresponds to your MySQL server version for the right syntax to use near 'ORDER' at
line 1
```
正确的
```sql
mysql> SELECT * FROM `ORDER`;
mysql> SELECT * FROM `order`;
```
如果我们的字段，表名与mysql保留字相同，需要使用着重号''

#### 10.查询常数
