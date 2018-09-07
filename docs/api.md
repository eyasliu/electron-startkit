###### Classes

<dl>
<dt><a href="#Request">Request</a></dt>
<dd><p>适配器数据请求对象</p>
</dd>
<dt><a href="#Response">Response</a></dt>
<dd><p>适配器数据回应类</p>
</dd>
</dl>

###### Constants

<dl>
<dt><a href="#Request">Request</a></dt>
<dd><p>路由处理，主要处理其他后端服务或其他进程发送来的消息，转发到具体的处理函数</p>
</dd>
</dl>

<a name="Request"></a>

###### Request
适配器数据请求对象

**Kind**: global class  
<a name="Response"></a>

###### Response
适配器数据回应类

**Kind**: global class  
**约定**: status 使用 http 的状态码，表示回应状态  

* [Response](#Response)
    * _instance_
        * [.status](#Response+status)
        * [.setDefaultOk()](#Response+setDefaultOk)
        * [.awaitSend()](#Response+awaitSend)
        * [.toJSON()](#Response+toJSON) ⇒ <code>object</code>
    * _static_
        * [.extends(mixin)](#Response.extends)

<a name="Response+status"></a>

####### response.status
最初始的默认状态应该是 404

**Kind**: instance property of [<code>Response</code>](#Response)  
<a name="Response+setDefaultOk"></a>

####### response.setDefaultOk()
设置一下默认的成功返回状态

**Kind**: instance method of [<code>Response</code>](#Response)  
<a name="Response+awaitSend"></a>

####### response.awaitSend()
等到通知成功或者失败

**Kind**: instance method of [<code>Response</code>](#Response)  
<a name="Response+toJSON"></a>

####### response.toJSON() ⇒ <code>object</code>
序列化回应数据，获取回应数据

**Kind**: instance method of [<code>Response</code>](#Response)  
<a name="Response.extends"></a>

####### Response.extends(mixin)
使得回应可以扩展，比如需要增加 send(), ok(), json(), notfound() 之类的快捷工具

**Kind**: static method of [<code>Response</code>](#Response)  

| Param | Type | Description |
| --- | --- | --- |
| mixin | <code>object</code> | 扩展函数集合 |

<a name="Request"></a>

###### Request
路由处理，主要处理其他后端服务或其他进程发送来的消息，转发到具体的处理函数

**Kind**: global constant  
