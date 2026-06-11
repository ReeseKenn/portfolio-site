# 个人作品集

这是我的个人作品集网站源码，用于展示前端开发经验、代表项目和技术能力。

## 在线预览

访问地址：

```text
。。。
```

## 关于我

我是一名前端开发工程师，主要关注 ERP、B 端系统、中后台管理平台、数据看板和前端工程效率。


## 技术栈

- React
- Vue
- TypeScript
- Vite
- CSS

## 本地运行

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```

本地预览构建结果：

```bash
npm run preview
```

## 内容配置

页面内容不直接写在组件代码中。

- 示例内容：`src/content/siteContent.example.json`
- 本地内容：`src/content/siteContent.local.json`
- 生成内容：`src/content/siteContent.generated.ts`

`siteContent.local.json` 和 `siteContent.generated.ts` 不提交到源码仓库。本地构建时，内容会被打包进静态页面。

## 部署

当前推荐本地构建后发布 `dist`：

```bash
./bin/deploy_to_github.sh
```

## 联系方式

- 邮箱：yanbaorui1997@163.com
- GitHub: `。。。`
