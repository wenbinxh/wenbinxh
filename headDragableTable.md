## 超级简单的el-table表头拖拽组件

下面代码可直接拷贝，无需安装新的依赖;

引入此组件后，只需将 `<el-table>` 标签改为 `<head-dragable-table>`即可开启表头拖拽功能。

效果参考动图：

![](https://raw.githubusercontent.com/xuebinWu/wenbinWu/master/statics/imgs/dragableHeader.gif)

```js
<template>
  <div id="head-dragable-table" class="head-dragable-table" @drop="drop($event)" @dragover="dragover">
    <el-table
      ref="dragableTable"
      :data="data"
      v-bind="$attrs"
      v-on="$listeners"
      header-cell-class-name="head-dragable-table-header">
      <template>
        <slot></slot>
      </template>
    </el-table>
  </div>
</template>

<script>
import { Checkbox } from 'element-ui'
export default {
  name: 'HeadDragableTable',
  props: {
    data: Array
  },
  data() {
    return {}
  },
  methods: {
    dragstart(e, index) {
      e.dataTransfer.setData('startIndex', index)
      e.dataTransfer.setData('startClientX', e.clientX)
      e.stopPropagation()
    },
    dragend(e) {
      e.dataTransfer.clearData()
    },
    dragover(e) {
      e.preventDefault()
    },
    drop(e) {
      const headerNodes = document.getElementById('head-dragable-table').getElementsByClassName('head-dragable-table-header')
      const offsetLefts = []
      Array.from(headerNodes).forEach(item => {
        offsetLefts.push(item.offsetLeft)
      })
      const startClientX = e.dataTransfer.getData('startClientX')
      const startIndex = Number(e.dataTransfer.getData('startIndex'))
      const moveDistance = e.clientX - startClientX

      // 计算拖动的距离，判断是否需要变换位置
      let afterDragOffsetLeft = offsetLefts[startIndex] + moveDistance
      if (moveDistance < 0 && offsetLefts.length > startIndex + 1) { // array.length = 16, 最大可取到 array[15]
        afterDragOffsetLeft = offsetLefts[startIndex + 1] + moveDistance
      }
      let afterIndex = 0
      offsetLefts.forEach((left, _index) => {
        if (afterDragOffsetLeft > left) {
          afterIndex = _index
        }
      })
      if (afterIndex === startIndex) {
        // 未调整顺序
        return
      }
      const dragedItem = this.$refs['dragableTable'].store.states._columns.splice(startIndex, 1)
      this.$refs['dragableTable'].store.states._columns.splice(afterIndex, 0, dragedItem[0])
      this.$refs['dragableTable'].store.updateColumns()
    },
    renderHeader(h, { column, $index, _self }) {
      if (column.type === 'selection') {
        return h(Checkbox, {
          on: {
            change: _self.selectionChange
          }
        })
      }
      return h('div', {
        style: {
          cursor: 'move'
        },
        attrs: {
          draggable: 'true'
        },
        on: {
          dragstart: function(event) { _self.dragstart(event, $index) },
          dragend: _self.dragend
        }
      }, column.label)
    },
    clearSelection() {
      this.$refs['dragableTable'].clearSelection()
    },
    toggleRowSelection(row) {
      this.$refs['dragableTable'].toggleRowSelection(row)
    },
    selectionChange() {
      this.$refs['dragableTable'].toggleAllSelection()
    }
  },
  mounted() {
    const columns = this.$refs['dragableTable'].store.states._columns
    columns && columns.forEach(column => {
      column.renderHeader = this.renderHeader
    })
  }
}
</script>
<style lang="less" scoped>
</style>
```