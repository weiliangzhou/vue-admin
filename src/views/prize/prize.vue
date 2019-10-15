<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入名称"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/prize/add']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="奖品名称" prop="name"/>
      <el-table-column align="center" label="市场价格" prop="marketPrice" sortable/>
      <el-table-column align="center" label="实际价格" prop="marketPrice" sortable/>
      <el-table-column align="center" label="参与条件" prop="marketPrice" sortable/>
      <el-table-column align="center" label="开奖条件" prop="marketPrice" sortable/>
      <el-table-column align="center" label="创建时间" prop="createTime" sortable/>
      <el-table-column align="center" label="开奖时间" prop="drawTime" sortable/>
      <el-table-column align="center" label="显示状态" prop="displayState">
        <template slot-scope="scope">
          <el-tag >{{ showDic[scope.row.displayState] }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>
        <el-form-item label="市场价格" prop="marketPrice">
          <el-input v-model="dataForm.marketPrice"/>
        </el-form-item>
        <el-form-item label="成本价格" prop="costPrice">
          <el-input v-model="dataForm.costPrice"/>
        </el-form-item>
        <el-form-item label="图片1" prop="imgUrl1">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadImage1"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.imgUrl1" :src="dataForm.imgUrl1" class="avatar" width="200px">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片2" prop="imgUrl2">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadImage2"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.imgUrl2" :src="dataForm.imgUrl2" class="avatar" width="200px">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片3" prop="imgUrl3">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadImage3"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.imgUrl3" :src="dataForm.imgUrl3" class="avatar" width="200px">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>

        <el-form-item label="描述" prop="desc">
          <el-input v-model="dataForm.desc"/>
        </el-form-item>

        <el-form-item label="参与开始时间" prop="startTime">
            <div class="block">
              <span class="demonstration">默认</span>
              <el-date-picker
                v-model="dataForm.startTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="参与截止时间" prop="endTime">
          <div class="block">
            <span class="demonstration">默认</span>
            <el-date-picker
              v-model="dataForm.endTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="开奖时间" prop="drawTime">
          <div class="block">
            <span class="demonstration">默认</span>
            <el-date-picker
              v-model="dataForm.drawTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="显示状态" prop="displayState">
          <el-radio-group v-model="dataForm.displayState">
            <el-radio label="0" >隐藏</el-radio>
            <el-radio label="1" >显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="最低参与人数" prop="limitCountMin">
          <el-input v-model="dataForm.limitCountMin"/>
        </el-form-item>
        <el-form-item label="最大参与人数" prop="limitCountMax">
          <el-input v-model="dataForm.limitCountMax"/>
        </el-form-item>
        <el-form-item label="限制条件" prop="limitType">
          <el-radio-group v-model="dataForm.limitType">
            <el-radio label="0" >无限制条件</el-radio>
            <el-radio label="1" >看广告</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="抽奖类型" prop="activityType">
          <el-radio-group v-model="dataForm.activityType">
            <el-radio label="1" >限时</el-radio>
            <el-radio label="2" >限时限人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="初始参与人数" prop="playerCountInit">
          <el-input v-model="dataForm.playerCountInit"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createPrize, updatePrize } from '@/api/prize'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'Prize',
  components: { Pagination },
  data() {
    return {
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
      downloadLoading: false,
      showDic: ['显示', '不显示'],
      dataForm: {
        kid: undefined,
        name: undefined,
        marketPrice: undefined,
        costPrice: undefined,
        imgUrl1: undefined,
        imgUrl2: undefined,
        imgUrl3: undefined,
        desc: undefined,
        startTime: undefined,
        endTime: undefined,
        drawTime: undefined,
        displayState: undefined,
        limitCountMin: undefined,
        limitCountMax: undefined,
        limitType: 1,
        activityType: 1,
        playerCountInit: undefined
      },
      uploadPath: process.env.BASE_API + '/file/upload',
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        costPrice: [{ required: true, message: '成本价格不能为空', trigger: 'blur' }],
        imgUrl1: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
        playerCountInit: [{ required: true, message: '初始参与人数不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    headers() {
      return {
        'token': getToken()
      }
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
        this.total = response.data.data.total
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
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createPrize(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    uploadImage1: function(response) {
      this.dataForm.imgUrl1 = response.data
    },
    uploadImage2: function(response) {
      this.dataForm.imgUrl2 = response.data
    },
    uploadImage3: function(response) {
      this.dataForm.imgUrl3 = response.data
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updatePrize(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    resetForm() {
      this.dataForm = {
        kid: undefined,
        name: undefined,
        marketPrice: undefined,
        costPrice: undefined,
        imgUrl1: undefined,
        imgUrl2: undefined,
        imgUrl3: undefined,
        desc: undefined,
        startTime: undefined,
        endTime: undefined,
        drawTime: undefined,
        displayState: undefined,
        limitCountMin: undefined,
        limitCountMax: undefined,
        limitType: undefined,
        activityType: undefined,
        playerCountInit: undefined
      }
    }
  }
}
</script>
