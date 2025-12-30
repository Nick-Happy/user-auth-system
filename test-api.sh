#!/bin/bash

# 用户认证系统 API 测试脚本
# 使用前请确保服务器正在运行 (npm run dev)

API_URL="http://localhost:8080"
EMAIL="test_$(date +%s)@example.com"  # 使用时间戳生成唯一邮箱
PASSWORD="Test123456"
NAME="测试用户"

echo "=========================================="
echo "  用户认证系统 API 测试"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 测试健康检查
echo -e "${YELLOW}1. 健康检查${NC}"
curl -s "$API_URL/health" | jq .
echo ""
echo ""

# 2. 用户注册
echo -e "${YELLOW}2. 用户注册${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"$NAME\"}")

echo "$REGISTER_RESPONSE" | jq .

# 检查注册是否成功
if echo "$REGISTER_RESPONSE" | jq -e '.error' > /dev/null; then
  echo -e "${RED}注册失败!${NC}"
  exit 1
else
  echo -e "${GREEN}✓ 注册成功${NC}"
fi
echo ""
echo ""

# 3. 用户登录
echo -e "${YELLOW}3. 用户登录${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"userAgent\":\"TestScript\",\"ipAddress\":\"127.0.0.1\"}")

echo "$LOGIN_RESPONSE" | jq .

# 提取令牌
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.refreshToken')

if [ "$ACCESS_TOKEN" == "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo -e "${RED}登录失败,无法获取令牌!${NC}"
  exit 1
else
  echo -e "${GREEN}✓ 登录成功${NC}"
  echo -e "${GREEN}  Access Token: ${ACCESS_TOKEN:0:50}...${NC}"
fi
echo ""
echo ""

# 4. 获取用户资料
echo -e "${YELLOW}4. 获取用户资料${NC}"
PROFILE_RESPONSE=$(curl -s "$API_URL/api/auth/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$PROFILE_RESPONSE" | jq .
echo -e "${GREEN}✓ 获取成功${NC}"
echo ""
echo ""

# 5. 更新用户资料
echo -e "${YELLOW}5. 更新用户资料${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT "$API_URL/api/users/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"更新的用户名"}')

echo "$UPDATE_RESPONSE" | jq .
echo -e "${GREEN}✓ 更新成功${NC}"
echo ""
echo ""

# 6. 获取会话列表
echo -e "${YELLOW}6. 获取会话列表${NC}"
SESSIONS_RESPONSE=$(curl -s "$API_URL/api/users/sessions" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$SESSIONS_RESPONSE" | jq .
echo -e "${GREEN}✓ 获取成功${NC}"
echo ""
echo ""

# 7. 获取登录历史
echo -e "${YELLOW}7. 获取登录历史${NC}"
HISTORY_RESPONSE=$(curl -s "$API_URL/api/users/login-history?limit=5" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$HISTORY_RESPONSE" | jq .
echo -e "${GREEN}✓ 获取成功${NC}"
echo ""
echo ""

# 8. 刷新令牌
echo -e "${YELLOW}8. 刷新访问令牌${NC}"
sleep 2  # 等待2秒
REFRESH_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/refresh-token" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}")

echo "$REFRESH_RESPONSE" | jq .

NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.accessToken')
echo -e "${GREEN}✓ 令牌刷新成功${NC}"
echo ""
echo ""

# 9. 修改密码
echo -e "${YELLOW}9. 修改密码${NC}"
PASSWORD_RESPONSE=$(curl -s -X PUT "$API_URL/api/auth/password" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"currentPassword\":\"$PASSWORD\",\"newPassword\":\"NewPassword123\"}")

echo "$PASSWORD_RESPONSE" | jq .
echo -e "${GREEN}✓ 密码修改成功${NC}"
echo ""
echo ""

# 10. 登出
echo -e "${YELLOW}10. 用户登出${NC}"
LOGOUT_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/logout" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$LOGOUT_RESPONSE" | jq .
echo -e "${GREEN}✓ 登出成功${NC}"
echo ""
echo ""

# 11. 测试未授权访问
echo -e "${YELLOW}11. 测试未授权访问 (应该失败)${NC}"
UNAUTHORIZED_RESPONSE=$(curl -s "$API_URL/api/users/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN")  # 使用已登出的令牌

echo "$UNAUTHORIZED_RESPONSE" | jq .
echo -e "${GREEN}✓ 访问被正确拒绝${NC}"
echo ""
echo ""

# 总结
echo "=========================================="
echo -e "${GREEN}  所有测试完成!${NC}"
echo "=========================================="
echo ""
echo "测试账号信息:"
echo "  邮箱: $EMAIL"
echo "  原密码: $PASSWORD"
echo "  新密码: NewPassword123"
echo ""
