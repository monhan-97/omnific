## 1. 锁定上游源码

- [x] 1.1 从 `https://github.com/lucide-icons/lucide.git` 选择并记录一个不可变的 commit。
- [x] 1.2 为每个参考的图标记录上游文件路径和本地组件名称，并明确上游名称只用于审计映射。
- [x] 1.3 确认锁定版本所采用的 Lucide 许可证，并在 `packages/icons` 中添加必要的署名信息。

## 2. 对齐 React 实现

- [x] 2.1 严格参考锁定的 `lucide-react` 源码实现本地命名的图标类型和共享 SVG 渲染逻辑，保持所需 props 行为和 ref 转发方式。
- [x] 2.2 严格参考锁定版本的最小组件创建模式，但使用 Omnific 文件名、符号名和类型名，不复制上游命名，不添加生成器、注册表或运行时依赖。
- [x] 2.3 使用锁定版本的 `loader-circle` 图标节点数据重建 `LoadingIcon`，移除自定义 SVG 节点或路径修改。
- [x] 2.4 确保 `packages/icons` 中的组件名、文件名、内部符号、导出、公开类型和运行时 class token 均使用 Omnific 命名，不出现上游品牌命名。

## 3. 验证一致性

- [x] 3.1 添加从锁定上游源码生成的 fixture 或 snapshot，并断言元素名称、元素顺序和所有 SVG 几何属性。
- [x] 3.2 验证参考实现的默认值、自定义 SVG props、children、ref 转发、`size`、`color`、`strokeWidth` 和 `absoluteStrokeWidth`，并验证 `className` 只透传调用方提供的值且不注入上游品牌 class token。
- [x] 3.3 保持 package README 只记录当前项目用法，并在 `NOTICE.md` 记录源码 commit、图标映射关系、许可证署名和本地命名适配边界。
- [x] 3.4 运行仓库定义的 typecheck、lint、test 和 package build 命令。
