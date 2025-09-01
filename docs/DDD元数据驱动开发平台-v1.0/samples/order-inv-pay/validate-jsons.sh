#!/bin/bash

# 设置路径变量
SCHEMA_DIR="/Users/work/src.working/yudao-cloud-mini/docs/DDD元数据驱动开发平台-v1.0"
JSON_DIR="/Users/work/src.working/yudao-cloud-mini/docs/DDD元数据驱动开发平台-v1.0/samples/order-inv-pay"

echo "=== DDD元数据模型JSON验证 ==="
echo "Schema目录: $SCHEMA_DIR"
echo "JSON实例目录: $JSON_DIR"
echo ""

# 检查必要文件是否存在
if [ ! -f "$SCHEMA_DIR/root.schema.json" ]; then
    echo "错误: root.schema.json 不存在于 $SCHEMA_DIR"
    exit 1
fi

# 定义引用映射 - 将相对路径映射到绝对路径
REFS_MAPPING="{
  \"./ubiquitous-language.schema.json\":\"$SCHEMA_DIR/ubiquitous-language.schema.json\",
  \"./strategic-design.schema.json\":\"$SCHEMA_DIR/strategic-design.schema.json\",
  \"./tactical-design.schema.json\":\"$SCHEMA_DIR/tactical-design.schema.json\",
  \"./implementation-mapping.schema.json\":\"$SCHEMA_DIR/implementation-mapping.schema.json\",
  \"./data-transfer-objects.schema.json\":\"$SCHEMA_DIR/data-transfer-objects.schema.json\"
}"

echo "引用映射配置:"
echo "$REFS_MAPPING"
echo ""

# 验证order.root.json（主文件）
echo "=== 验证主文件 order.root.json ==="
if ajv validate -s "$SCHEMA_DIR/root.schema.json" -d "$JSON_DIR/order.root.json" \
  --spec=draft2020 --strict=false \
  --refs="$REFS_MAPPING"; then
    echo "✅ order.root.json 验证成功"
else
    echo "❌ order.root.json 验证失败"
    exit 1
fi

echo ""

# 验证各个子模块文件
echo "=== 验证子模块文件 ==="

# 验证ubiquitous-language.json
echo "验证 ubiquitous-language.json..."
if ajv validate -s "$SCHEMA_DIR/ubiquitous-language.schema.json" -d "$JSON_DIR/ubiquitous-language.json" \
  --spec=draft2020 --strict=false; then
    echo "✅ ubiquitous-language.json 验证成功"
else
    echo "❌ ubiquitous-language.json 验证失败"
fi

# 验证strategic-design.json
echo "验证 strategic-design.json..."
if ajv validate -s "$SCHEMA_DIR/strategic-design.schema.json" -d "$JSON_DIR/strategic-design.json" \
  --spec=draft2020 --strict=false; then
    echo "✅ strategic-design.json 验证成功"
else
    echo "❌ strategic-design.json 验证失败"
fi

# 验证tactical-design.json
echo "验证 tactical-design.json..."
if ajv validate -s "$SCHEMA_DIR/tactical-design.schema.json" -d "$JSON_DIR/tactical-design.json" \
  --spec=draft2020 --strict=false; then
    echo "✅ tactical-design.json 验证成功"
else
    echo "❌ tactical-design.json 验证失败"
fi

# 验证implementation-mapping.json
echo "验证 implementation-mapping.json..."
if ajv validate -s "$SCHEMA_DIR/implementation-mapping.schema.json" -d "$JSON_DIR/implementation-mapping.json" \
  --spec=draft2020 --strict=false; then
    echo "✅ implementation-mapping.json 验证成功"
else
    echo "❌ implementation-mapping.json 验证失败"
fi

# 验证data-transfer-objects.json
echo "验证 data-transfer-objects.json..."
if ajv validate -s "$SCHEMA_DIR/data-transfer-objects.schema.json" -d "$JSON_DIR/data-transfer-objects.json" \
  --spec=draft2020 --strict=false; then
    echo "✅ data-transfer-objects.json 验证成功"
else
    echo "❌ data-transfer-objects.json 验证失败"
fi

echo ""
echo "=== 验证完成 ==="