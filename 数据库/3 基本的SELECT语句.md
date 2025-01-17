### 1.SQL分类

SQL语言在功能上主要分入三大类：
- <font color="yellow">DDL (Data Definition Languages,数据定义语言)</font>，这些语句定义了不同的数据库，表，视图，索引等数据库对象，还可以用来创建，删除，修改数据库和数据表的结构。
  - 主要的语句关键字包括<font color="yellow">CREATE DROP ALTER</font>等。
- <font color="yellow">DML (Data Manipulation Language 数据操作语言)</font>，用于添加，删除，更新查询数据库记录，并且检查数据完整性。
  - 主要语句关键字包括<font color="yellow">INSERT DELETE UPDATE SELECT</font>等。
  - SELECT是SQL语言的基础，最为重要
- <font color="yellow">DCL （Data Control Language 数据控制语言）</font>，用于定义数据库，表，字段，用户的访问权限和安全级别。
  - 主要的语句关键字包括<font color="yellow">GRANT REVOKE COMMIT ROLLBACK SAVEPOINT</font>等。
 ```
 因为查询语句使用的非常频繁，所以很多人把查询语句单独拎出来：DQL（数据查询语言）。
 还有单独将COMMIT ROLLBACK取出来称之为TCL（Transaction Control Language 事务控制语言）。
```
### 2.SQL大小写规范

MySQL 在 Windows 环境下是大小写不敏感的
MySQL 在 Linux 环境下是大小写敏感的

推荐采用统一的书写规范：
数据库名、表名、表别名、字段名、字段别名等都小写
SQL 关键字、函数名、绑定变量等都大写
#### 注释
```
单行注释：#注释文字(MySQL特有的方式)
单行注释：-- 注释文字(--后面必须包含一个空格。)
多行注释：/* 注释文字 */
```
#### 数据指令导入
`source d:\mysqldb.sql`
### 3.基本的SELECT语句
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
#### 列的别名
可以使用as 或者不使用
```
SELECT last_name AS name, commission_pct comm
FROM employees;
空格应该添加双引号
SELECT last_name "Name", salary*12 "Annual Salary"
FROM employees;
```
#### 去除重复行
DISTINCT
默认情况下，查询会返回全部行，包括重复行
```
SELECT DISTINCT department_id 
FROM employees;
```
有两点需要注意
1. DISTINCT 需要放到所有列名的前面，如果写成 SELECT salary, DISTINCT department_id
FROM employees 会报错。
2. DISTINCT 其实是对后面所有列名的组合进行去重，你能看到最后的结果是 74 条，因为这 74 个部门id不同，都有 salary 这个属性值。如果你想要看都有哪些不同的部门（department_id），只需要写 DISTINCT department_id 即可，后面不需要再加其他的列名了。
   
#### 空值运算符
- 所有运算符或者列值遇到null值，运算结果都为null
```sql
select employee_id,salary,commission_pct,
12 * salary * (1 + commission_pct) "annual_sal"
from employees;
```
MySQL里面，空值不等于空字符串。一个空字符串的长度是0，空值长度是空，空占用空间
#### 着重号
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

#### 查询常数
SELECT 查询还可以对常数进行查询，在SELECT查询结果中增加一列固定的常数列。==这列的取值是我们指定的，而不是数据表中动态取出的==
为什么要对常数查询？
SQL中的SELECT语法的确提供了这个功能，一般来说我们只从一个表中查询数据，通常不需要增加一个固定的常数列，但如果我们向整合不同的数据源，用常数列作为这个表的标记，就需要查询这个常数。
比如说，我们相对employees数据表中的员工姓名进行查询，同时增加一列字段corporation，这个字段固定值为“尚硅谷”，可以这样写
```sql
select '尚硅谷' as corporation, last_name from employees;
```
### 4.显示表结构
DESCRIBE 或者DESC命令
```sql
describe employees;
desc employees;
```
![[数据库/image/Pasted image 20241103174926.png|400]]
Field：标识字段名称
Type：表示字段类型，这里barcode,goodsname是文本类型的，price是整数类型的
Null表示该列是否可以存储NULL值
Key：表示该列是否已编制索引。PRI表示该列是表主键的一部分；UNI表示该列是UNIQUE索引的一部分；MUL表示在列中某个给定值允许出现多次
Default：表示该列是否又默认值，如果有，那么值是多少
Extra：表示可以获取与给定列有关的附加信息，列入AUTO_INCREMENT等。
### 5.过滤数据
WHERE
语法：
```sql
SELECT 字段1,字段2
FROM 表名
WHERE 过滤条件
```
列，取出部门号90所有员工数据
```sql
SELECT * FROM employees
WHERE department_id=90;
```

