# arco-design-new

## 介绍

这是一个基于 Arco Design 的数据平台。

## 安装依赖

yarn install

## 启动项目

yarn start

## 测试环境地址

http://10.106.0.134:8401

## 生产环境地址

http://172.23.173.62:7070 会映射到 https://dataplatform.elu-ai.com (运维已经配置了反向代理)

## 本地运行 & 多环境配置说明

- 使用 Vite 的 mode（通过 `--mode <name>`）加载 `.env.<name>` 文件。
- 两个常用的变量：
  - `VITE_API_PROXY_TARGET`：仅用于本地开发时的 dev server proxy（当你运行 `vite --mode <name>` 时会生效）。
  - `VITE_API_BASE`：用于构建后在运行时作为 axios 的 base URL（在 `main.tsx` 已设置为 `axios.defaults.baseURL`）。

### 启动命令

- 本地开发（默认）: `yarn dev`
- 本地开发（连测试）: `yarn dev:test`
- 本地开发（接生产）: `yarn dev:prod`
- 构建（默认）: `yarn build`
- 构建（测试）: `yarn build:test`
- 构建（生产）: `yarn build:prod`

> 说明：

- 开发时我们使用 dev server 的 proxy（配置在 `vite.config.ts`），所以不必修改代码中现有的以 `/api` 开头的请求。
- 构建时，`axios.defaults.baseURL` 会读取 `VITE_API_BASE`，如需在构建时让静态站点直接请求后端，请在对应 `.env.<mode>` 中设置 `VITE_API_BASE`。
