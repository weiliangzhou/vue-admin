<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.nickname" clearable class="filter-item" style="width: 200px;" placeholder="请输入昵称"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button type="primary" class="filter-item" icon="el-icon-message" @click="dialogVisible = true">发送短信</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="注册时间" prop="createTime"/>
      <el-table-column align="center" width="100px" label="用户ID" prop="kid" sortable/>
      <el-table-column align="center" label="昵称" prop="nickname"/>
      <el-table-column align="center" label="手机号码" prop="phone"/>
      <el-table-column align="center" label="性别" prop="gender">
        <template slot-scope="scope">
          <el-tag >{{ genderDic[scope.row.gender] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户等级" prop="userLevel">
        <template slot-scope="scope">
          <el-tag >{{ levelDic[scope.row.userType] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag>{{ stateDic[scope.row.state] }}</el-tag>
        </template>
      </el-table-column>

    </el-table>
    <div>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      title="发送短信"
      width="30%"
    >
      <span>
        <el-input
          :rows="4"
          v-model="textarea"
          type="textarea"
          placeholder="请输入内容"/>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="empty">清 空</el-button>
        <el-button type="primary" @click="send">发 送</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: undefined,
        mobile: undefined,
        sort: 'create_time',
        order: 'desc'
      },
      downloadLoading: false,
      dialogVisible: false,
      textarea: '',
      genderDic: ['未知', '男', '女'],
      levelDic: ['普通用户', '内部员工'],
      stateDic: ['可用', '禁用', '注销']
    }
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
    empty() {
      this.textarea = ''
    },
    send() {
      // todo
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>
.app-container /deep/ .el-pagination{
  display: flex;
  justify-content: flex-end;

}
</style>
