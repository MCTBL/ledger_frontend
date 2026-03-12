# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 运行阶段
FROM nginx:alpine

# 安装 envsubst (如果镜像中没有，nginx:alpine 通常自带，但确保一下也无妨)
RUN apk add --no-cache gettext

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置模板（假设放在项目根目录的 nginx.conf.template）
COPY nginx.conf.template /etc/nginx/conf.d/nginx.conf.template

# 暴露端口
EXPOSE 80

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# # 启动命令：使用 envsubst 替换模板中的变量，生成最终配置，然后启动 nginx
# CMD sh -c "envsubst '$$BACKEND_HOST' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf && rm /etc/nginx/conf.d/nginx.conf.template && nginx -g 'daemon off;'"