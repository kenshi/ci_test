# CI구축
    - $ mkdir CI_TEST
    - $ cd CI_TEST    
    - git 생성
        - https://github.com/kenshi/ci_test.git
        - .gitignore => node
        - license -> MIT
        - git clone https://github.com/kenshi/ci_test.git
    - $ npm init -y
    - package.json 추가
        ```
            "repository": {
                "type": "git",
                "url": "git+https://github.com/kenshi/ci_test.git"
            },
            "bugs": {
                "url": "https://github.com/kenshi/ci_test/issues"
            },
            "homepage": "https://github.com/kenshi/ci_test#readme",
        ```
    - ESLint 설치
        - 코드 스타일 체크용
        - devDependencies에 세팅, 개발용 패키지 의존성 주입
        - $ npm install eslint --save-dev
    - .gitignore  깃에 올라가는 파일중 무시할 내용 설정
        - node_modules/
    - 코드 스타일 자동 완성 처리 파일 생성
        - npx : npm 설치하면 기본으로 제공
            - 모듈을 로컬에 저장하지 않고, 매번 최신 버전의 파일만을 임시로 불러와 실행 시킨 후에, 다시 그 파일은 없어지는 방식
        - $ npx eslint --init
            - 중간에 y
            - 진행이 멈처 보이면 엔터 진행
        - 생성 파일 .eslintrc.json or .eslintrc.js 
        - "rules" 추가
            - 권한이 걸리면 일단 chmod 777 .eslintrc.js
            - "semi": [2, "always"],
                - semi colon을 필요한 곳에 항상 붙이도록 설정한 것이고, 2개 이상의 세미콜론이 연속으로 나오는 경우를 막도록 설정했다.
            - "no-unused-vars": "warn"
                - 사용되지 않는 변수들이 존재할 경우 error가 아닌 warn을 유발하도록 설정
    - 프로젝트 구조
        - 구조
            ├── src
            │	├── functions
            │   │	├── add.js
            │   │	├── sub.js
            │   │	├── mul.js
            │   │	└── div.js
            │   └── index.js
            ├── test
            │   ├── integration             : 통합테스트용 테스트 코드
            │   │	└── index.test.js
            │   ├── unit                    : 단위 테스트용 테스트 파일
            │   │	├── add.test.js
            │   │	├── sub.test.js
            │   │	├── mul.test.js
            │   │	└── div.test.js
        - 파일 생성
    
    - 실행 및 ES 모듈
        - node ./src
        - 에러
        - 프로젝트 단위로 ES 모듈 적용
            - package.json
                - "type": "module"

    - Prettier
        - 코드 포맷팅을 위한 Prettier
        - .prettierrc 파일에 적힌 룰에 의해서 동작
        - .prettierrc 생성
            ```
                {
                    "bracketSpacing": false,
                    "jsxBracketSameLine": true,
                    "semi": true,
                    "singleQuote": true,
                    "trailingComma": "all",
                    "arrowParens": "avoid",
                    "endOfLine": "auto",
                    "tabWidth": 2
                }
            ```
        - npm 명령어를 사용하여 prettier를 설치
            - $ npm install prettier --save-dev
        - ESLint와 Prettier를 연동
            - $ npm install eslint-config-prettier --save-dev
        - .eslintrc.js 수정
            - 주의, prettier를 extends의 마지막에 넣어줘야 한다는 점
            - prettier 설정이 ESLint 코드 스타일 설정을 덮어쓸 수 있다.
            ```
                ...
                "extends": [
                    "eslint:recommended",
                    "plugin:react/recommended",
                    'prettier'
                ],
                ...
            ```
        - package.json
            - script 추가
            - "lint": "./node_modules/.bin/eslint ."
    
    - yaml  파일 생성
        - .github/workflows 폴더 생성
        - ci.yml 파일 생성
            ```
                name: Node.js CI

                # 구독할 이벤트
                on:
                push:
                    branches: [main]
                pull_request:
                    branches: [main]

                # jobs 단위로 개별 서버(정확히는 Docker 컨테이너 단위라고 한다.)에서 작업이 수행된다.
                # 각 작업은 병렬로 실행 된다고 하는데, needs: build와 같이 표시해서 기다릴 수도 있다.
                jobs:
                build:
                    # Ubuntu, Windows, MacOS를 지원한다.
                    runs-on: ubuntu-latest

                    # node-version 과 같이 배열로 돼있으면, 해당 원소를 순회하면서 작업이 반복해서 실행된다.
                    # 응용해서 runs-on에 여러 OS에서 돌릴 수도 있다.
                    strategy:
                    matrix:
                        node-version: [14.x] # 템플릿 기본값: [10.x, 12.x, 14.x]

                    # uses 개념은 다른 사람이 작성한 내용을 실행하는 개념이다.
                    # actions/checkout: GitHub의 마지막 커밋으로 Checkout 한다.
                    # actions/setup-node: Node.js를 설치한다.
                    # run 개념은 명령어를 실행한다. 셸 스크립트와 동일하다.
                    steps:
                    - uses: actions/checkout@v2
                    - name: Use Node.js ${{ matrix.node-version }}
                        uses: actions/setup-node@v1
                        with:
                        node-version: ${{ matrix.node-version }}
                    # npm ci는 npm install과 같은 기능을 수행한다.
                    - run: npm ci
                    # --if-present 옵션은 npm 스크립트가 존재할 때만 실행시키라는 의미이다.
                    # 만약 build 스크립트가 없는 경우, 오류 없이 지나간다.
                    - run: npm run build --if-present
                    # ESLint  수행 스크립트
                    - run: npm run lint
                    - run: npm test
            ```
        - vscode 플러그인 설치
            - GitHub Actions

    - test를 설정하기 위해 jest 라이브러리를 활용
        - $ npm install jest --save-dev
        - package.json의 script 부분에 다음 명령을 추가
            - "test": "jest"
        - ESLint와의 호환을 위해 eslint-plugin-jest를 설치
            - npm i --save-dev eslint-plugin-jest
    
    - 루트 위치에 eslintrc.yml 설치
        ```
            env:
                jest: true # Jest 글로벌
            plugins:
                - jest # Jest 테스트를 위해 플러그인이 필요하다.
            rules:
                # Jest Eslint 옵션은 0,1,2 (off, warn, error) 만 옵션으로 사용 가능하다.
            jest/no-disabled-tests:
                - warn
            jest/no-focused-tests:
                - error
            jest/no-identical-title:
                - error
            jest/prefer-to-have-length:
                - warn
            jest/valid-expect:
                - error
        ```

    - test code 
        - 테스트 코드 작성
        - add.test.js
        

