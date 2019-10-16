<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable style="width: 200px;" placeholder="请输入名称"/>
      <el-date-picker
        v-model="value"
        :picker-options="pickerOptions"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"/>
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/prize/add']" type="primary" icon="el-icon-edit" @click="$router.push('/activity/prize/add')">添加</el-button>
      <!-- <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button> -->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="奖品名称" width="200" prop="name"/>
      <el-table-column align="center" label="奖品价值" prop="marketPrice" width="120" sortable/>
      <el-table-column align="center" label="实际价值" prop="costPrice" width="120" sortable/>
      <el-table-column align="center" label="参与条件">
        <template slot-scope="scope">
          <span v-if="scope.row.limitType === 1">看广告</span>
          <span v-if="scope.row.limitType === 0">无限制</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开奖条件">
        <template slot-scope="scope">
          <span v-if="scope.row.activityType === 2">同时满足</span>
          <span v-if="scope.row.activityType === 1">到时开奖</span>
          <span v-if="scope.row.activityType === 0">满人开奖</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="180" prop="createTime" sortable/>
      <el-table-column align="center" label="开奖时间" width="180" prop="drawTime" sortable/>
      <el-table-column align="center" label="显示状态">
        <template slot-scope="scope">
          <el-tag >{{ showDic[scope.row.displayState] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开奖状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.drawState === 1">待开奖</el-tag>
          <el-tag v-if="scope.row.drawState === 0">已结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px" fixed="right">
        <template slot-scope="scope">
          <span v-if="scope.row.drawState === 0">
            <el-button type="text" style="color:#F56C6C" @click="result(scope.row.kid)">已开奖，查看结果</el-button>
          </span>
          <span v-if="scope.row.drawState === 1">
            <el-button type="text" @click="$router.push(`/activity/prize/edit?kid=${scope.row.kid}`)">编辑</el-button>
            <el-button type="text" @click="del(scope.row.kid)">删除</el-button>
            <el-button v-if="scope.row.displayState === 0" type="text" @click="upper(scope.row.kid)">上架</el-button>
            <el-button v-if="scope.row.displayState === 1" type="text" @click="upper(scope.row.kid)">下架</el-button>
            <el-button type="text" @click="openPrize(scope.row.kid)">开奖</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog
      :visible.sync="dialogVisible"
      title="开奖方式"
      width="30%">
      <div>
        <el-radio-group v-model="openMode">
          <el-radio :label="1">指定用户开奖</el-radio>
          <el-radio :label="2">随机开奖</el-radio>
        </el-radio-group>
        <div v-if="openMode === 1" style="margin-top:20px"><el-input v-model="userId" placeholder="请输入用户ID"/></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisible1"
      title="开奖结果"
      width="30%">
      <div style="text-align:center">
        <div>中奖者ID</div>
        <div>{{ luckList.kid }}</div>
        <div>中奖者手机号码</div>
        <div>{{ luckList.phone }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, openPrize, display, delPrize, viewWinner } from '@/api/prize'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'Prize',
  components: { Pagination },
  data() {
    return {
      value: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        sort: 'create_time',
        order: 'desc'
      },
      dialogVisible: false,
      dialogVisible1: false,
      downloadLoading: false,
      showDic: ['下架', '上架'],
      prizeKid: '',
      openMode: '',
      userId: '',
      luckList: ''
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },

  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = Number(response.data.data.total)
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleFilter() {
      console.log(this.value)
      if (this.value) {
        this.listQuery.startTime = this.value[0] || null
        this.listQuery.endTime = this.value[1] || null
      } else {
        this.listQuery.startTime = null
        this.listQuery.endTime = null
      }
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户名', '手机号码', '性别', '状态']
        const filterVal = ['username', 'mobile', 'gender', 'status']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '用户信息')
        this.downloadLoading = false
      })
    },
    openPrize(prizeKid) {
      this.dialogVisible = true
      this.prizeKid = prizeKid
      this.openMode = ''
      this.userId = ''
    },
    submit() {
      if (!this.openMode) {
        this.$message.error('请选择开奖方式')
        return false
      }
      if (this.openMode === 1 && !this.userId) {
        this.$message.error('请填写用户ID')
        return false
      }
      openPrize({ type: this.openMode, userKid: this.userId || null, prizeKid: this.prizeKid }).then(data => {
        this.dialogVisible = false
        this.getList()
      }).catch(err => {
        this.$message.error(err.data.errmsg)
      })
    },
    upper(kid) {
      display({ kid }).then(data => {
        this.$message.success('操作成功')
        this.getList()
      }).catch(err => {
        this.$message.error(err.data.errmsg)
      })
    },
    del(kid) {
      delPrize({ kid }).then(data => {
        this.$message.success('删除成功')
        this.getList()
      }).catch(err => {
        this.$message.error(err.data.errmsg)
      })
    },
    result(prizeKid) {
      viewWinner({ prizeKid }).then(data => {
        this.luckList = data.data.data
        this.dialogVisible1 = true
      }).catch(err => {
        this.$message.error(err.data.errmsg)
      })
    }
  }
}
</script>
<style scoped>
.app-container /deep/ .el-pagination{
  display:flex;
  justify-content: flex-end;
}
</style>
