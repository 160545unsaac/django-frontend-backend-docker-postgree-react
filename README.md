# 專案指引

建立 Django + RESTful API 專案模版，以軟體開發生命週期（SDLC）為範疇，示範如何導入 docker compose 之 VM 虛擬化技術，運用於「系統開發作業」之中。

專案特性：
 - Web: Django V1.11
 - API: Django REST Framework
 - DB: 
    * Engine: PostgreSQL
    * Lib:  psycopg2

# 系統開發作業

系統開發作業流程，由下列之「作業程序」所構成：
 - （一）建置系統開發環境作業程序
 - （二）初始資料庫作業程序
 - （三）檢驗開發中系統作業程序
 
 

## （一）建置系統開發環境作業程序

為「系統開發作業」進行之流暢，需進行事前籌備工作。透過 Dockerfile 、 docker-compose.yml 兩個檔案的建置工作，用以制定及規範「開發環境（Development）」及「正式環環（Production）」。

### 1. 進入專案根目錄。

```commandline
$ cd docker-compose-django-rest
$ workon django_env
```

### 2. 建立 Docker Build 程序設定檔。

建立檔案：Dockerfile ，並輸入以下之內容：
```buildoutcfg
FROM python:3.6.2

ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY . /code/
RUN pip install -r requirements.txt
```

當執行 docker build 指令時， Docker Engine 將依據 Dockerfile 檔案內容之描述，進行 Docker Image 檔案之建置工作。

已完成建置的 Docker Image 檔案，可用 docker images 指令查詢，藉以確認建置工作的確如預期完成。

### 3. 建立 Docker Compose 程序設定檔

建立檔案：docker-compose.yml ，並輸入以下之內容：
```buildoutcfg
version: '3.1'

services:

  db:
    image: postgres:10.1
    environment:
      POSTGRES_PASSWORD: Passw0rd
    ports:
      - "5432:5432"
    networks:
      - backend
    volumes:
      - pgdata:/var/lib/postgresql/data/

  web:
    build: .
    command: python src/project/manage.py runserver 0.0.0.0:8000
    restart: always
    volumes:
      - .:/code
    ports:
      - "8000:8000"
    networks:
      - backend
    depends_on:
      - db

volumes:
  pgdata:

networks:
  backend:
```

構成「應用系統」該有的「子系統」有那些？子系統之間是否有無相依關係（譬如：啟動 Web 子系統之前， DB 子系統需先備妥）？

透過 docker-compose.yml 檔案，可對待開發的應用系統，進行此「系統結構」性的描述，而 Docker Compose 則是據此檔案的描述，啟動 Docker Container ；甚或是在 Container 啟動之前，先備妥需要使用的 Docker Image 檔案（可能是自網路下載；或是依據 Dockerfile 的描述自行 Build 建置）。


### 4. 驗證設定無誤。
啟動 Docker Compose，用以驗證所有設定皆已正確無誤。

```commandline
$ docker-compose up
```


## （二）初始資料庫作業程序

Django Framework 對於「應用系統」的「資料庫」，在開始使用之前，有下列「初始化」之工作得先完成執行。

### 1. 初始化資料庫（PostgreSQL）。

自 Web 端的 Docker Container ，發動資料庫「初始化」之 migrate 指令。
```commandline
$ docker-compose exec web python src/my_project/manage.py migrate
```

若 Docker Compose 尚未啟用（docker-compose up 指令尚未執行），則可改用以下 run 指令，順道要求 Docker Compose 啟動。
```commandline
$ docker-compose run web python src/my_project/manage.py migrate
```


### 2. 建立管理員使用之帳號及密碼。
```commandline
$ docker-compose exec web python src/my_project/manage.py createsuperuser
```

### 3. 依據 Model 新建或變更資料庫中的表格（Table）。

要求 Django Framework ，透過 Model 之設計，建立或設資料庫之 Table 。
```commandline
$ docker-compose exec web python src/my_project/manage.py makemigrations
$ docker-compose exec web python src/my_project/manage.py migrate
```


## （三）檢驗開發中系統作業程序

系統開發作業之工作，進展到某一階段，需要檢驗其功能運作；或是觀察其執行之輸出結果時，依照以下之程序步驟進行操作。

### 1. 執行應用系統啟動指令。

```commandline
$ docker-compose up
```

### 2. 啟動 Web 瀏覽器軟體，並在網址列輸入 URL 網址。

```commandline
http://localhost:8000/api
```

### 3. 在 Web 瀏覽器觀察輸出結果。

### 4. 終結檢驗作業程序時，自終端機輸入以下指令。
```commandline
$ docker-compose down
```


### Docker Compose 呈現已啟動的狀態

```commandline
$ docker-compose ps
            Name                           Command               State           Ports
-----------------------------------------------------------------------------------------------
dockercomposedjangorest_db_1    docker-entrypoint.sh postgres    Up      0.0.0.0:5432->5432/tcp
dockercomposedjangorest_web_1   python src/my_project/mana ...   Up      0.0.0.0:8000->8000/tcp
```

### Docker Container 處於「執行中」狀態

```commandline
$ docker ps
CONTAINER ID        IMAGE                         COMMAND                  CREATED             STATUS              PORTS                    NAMES
fef0139d7bad        dockercomposedjangorest_web   "python src/my_proje…"   2 hours ago         Up 2 hours          0.0.0.0:8000->8000/tcp   dockercomposedjangorest_web_1
d8e0c3871868        postgres:10.1                 "docker-entrypoint.s…"   2 hours ago         Up 2 hours          0.0.0.0:5432->5432/tcp   dockercomposedjangorest_db_1
```

### 在 Host 電腦中會記錄已建立的 Docker Container 其 ID / Name / Image 的關聯。 

```commandline
$ docker ps -a
CONTAINER ID        IMAGE                                 COMMAND                  CREATED             STATUS                      PORTS                    NAMES
fef0139d7bad        dockercomposedjangorest_web           "python src/my_proje…"   2 hours ago         Up 2 hours                  0.0.0.0:8000->8000/tcp   dockercomposedjangorest_web_1
d8e0c3871868        postgres:10.1                         "docker-entrypoint.s…"   2 hours ago         Up 2 hours                  0.0.0.0:5432->5432/tcp   dockercomposedjangorest_db_1
3199ca88bafb        byobprofilesrestapi_web               "python src/profiles…"   23 hours ago        Exited (137) 23 hours ago                            byobprofilesrestapi_web_1
62daf2d9686a        byobprofilesrestapi_web               "python src/profiles…"   23 hours ago        Exited (1) 9 hours ago                               byobprofilesrestapi_web_run_1
786f3da3170d        postgres:10.1                         "docker-entrypoint.s…"   23 hours ago        Exited (137) 23 hours ago                            byobprofilesrestapi_db_1
5281d4ef62a0        microsoft/mssql-server-linux:latest   "/bin/sh -c /opt/mss…"   12 days ago         Exited (255) 11 days ago    0.0.0.0:1433->1433/tcp   ms-sql
e3cd59d5fdb8        microsoft/mssql-server-linux:latest   "/bin/sh -c /opt/mss…"   12 days ago         Exited (137) 12 days ago                             ms-sql-server
```


### Docker Image 檔案已完成下載／建置

 - Web: dockercomposedjangorest_web:latest
 - DB: postgres:10.1

```commandline
$ docker image ls
REPOSITORY                     TAG                 IMAGE ID            CREATED             SIZE
dockercomposedjangorest_web    latest              085699979f77        8 hours ago         744MB
byobprofilesrestapi_web        latest              0edb5d1004e0        23 hours ago        745MB
microsoft/mssql-server-linux   latest              cb3198f4b4d3        3 weeks ago         1.35GB
postgres                       10.1                ec61d13c8566        7 weeks ago         287MB
python                         3.6.2               26acbad26a2c        4 months ago        690MB
mongo                          3.4.2               5bc602c0b7fe        10 months ago       360MB
ubuntu                         latest              45bc58500fa3        16 months ago       127MB
nginx                          latest              4efb2fcdb1ab        17 months ago       183MB
hello-world                    latest              b77358fac48b        2 years ago         960B
```

### Docker Compose 所需使用之「網路環境」已建置（dockercomposedjangorest_backend）

```commandline
$ docker network ls
NETWORK ID          NAME                              DRIVER              SCOPE
cb4812c6a870        bridge                            bridge              local
579c3d75e23d        byobprofilesrestapi_backend       bridge              local
037f918aee12        dockercomposedjangorest_backend   bridge              local
5b35580b61c1        host                              host                local
b864ac2621e7        none                              null                local
```

---

# 系統開發維運作業

## 資料庫管理作業程序

使用 pgAdmin4 ，透過 GUI 介面，對 PostgreSQL 資料庫進行管理。

### 1. 啟動 pgAdmin 4

### 2. 建置 Server Connection

    - General.Name: docker_db
    - Connection:
        * Host name/address: 127.0.0.1
        * Port: 5432
        * Maintenance database: postgres
        * Username: postgres
        * Password: Passw0rd

### 3. 啟動 Server Connection

## 強迫資料庫更新（Migrate）

對於 Django 中的某 app ，因已執行過 makemagrations, migrate 等指令，致使後續的 migrate 指令，無法再使資料庫執行 Table 之新建或變更動作。 

以下之操作，以第一次的 migration 之後就出狀況為例。
（參考文件：[How to force certain migration?
](https://stackoverflow.com/questions/12364157/south-how-to-force-certain-migration)）

### 1. 指定 app 自未達成之 migration 先倒退一步。 

```commandline
AlanJui at MacBook-Pro.local in [~/workspace/docker/docker-compose-django-rest/src/my_project]  on git:master ✗  043b3d3 "修訂《專案指引》內容"
18:24:29 $ docker-compose exec web python src/my_project/manage.py migrate --fake webapp zero
Operations to perform:
  Unapply all migrations: webapp
Running migrations:
  Rendering model states... DONE
  Unapplying webapp.0001_initial... FAKED
```

### 2. 要求 app 再度執行未達成之 migration 。

```commandline
AlanJui at MacBook-Pro.local in [~/workspace/docker/docker-compose-django-rest/src/my_project]  on git:master ✗  043b3d3 "修訂《專案指引》內容"
18:26:08 $ docker-compose exec web python src/my_project/manage.py migrate webapp
Operations to perform:
  Apply all migrations: webapp
Running migrations:
  Applying webapp.0001_initial... OK
```

## 網路管理作業程序

### 1. 查詢「使用之網路組態」。

```commandline
$ docker network ls
NETWORK ID          NAME                              DRIVER              SCOPE
cb4812c6a870        bridge                            bridge              local
579c3d75e23d        byobprofilesrestapi_backend       bridge              local
c0c769f533c4        dockercomposedjangorest_backend   bridge              local
5b35580b61c1        host                              host                local
b864ac2621e7        none                              null                local
```

### 2. 查詢 DB 之 IP。
```commandline
$ docker network inspect dockercomposedjangorest_backend
[
    {
        "Name": "dockercomposedjangorest_backend",
        "Id": "c0c769f533c408160e6a874a480a81e4c4ff454825c6ad3f23be616d7149de61",
        "Created": "2018-01-30T09:22:30.967929943Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "172.19.0.0/16",
                    "Gateway": "172.19.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": true,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "019da24842e1a86e08db5980d8ea979f88e42a0e934b3e91ae87b9f18c758376": {
                "Name": "dockercomposedjangorest_db_1",
                "EndpointID": "c1958eb1cb457efec0474d4ae4146b89e83a15366c2c6f3b2b4f6fb5148abff7",
                "MacAddress": "02:42:ac:13:00:02",
                "IPv4Address": "172.19.0.2/16",
                "IPv6Address": ""
            },
            "08aaa955316f14186d698daf9d312cb5800806fd1c3c8e468ff06581d1af6a7b": {
                "Name": "dockercomposedjangorest_web_1",
                "EndpointID": "ab2b69afd905aa5dcdbace9a24966384770ac3a4fd2b2580c5bf1a8015369a3b",
                "MacAddress": "02:42:ac:13:00:03",
                "IPv4Address": "172.19.0.3/16",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {
            "com.docker.compose.network": "backend",
            "com.docker.compose.project": "dockercomposedjangorest"
        }
    }
]
```


---

# 參考來源

參考網路教學文章：[Profiles REST API](https://github.com/LondonAppDeveloper/byob-profiles-rest-api) -- REST API providing basic functionality for managing user profiles.
