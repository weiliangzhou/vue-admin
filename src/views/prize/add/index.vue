<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="top" class="from-list">
      <el-form-item label="图片1" prop="imgUrl1" style="width:33%">
        <el-upload
          :headers="headers"
          :action="uploadPath"
          :show-file-list="false"
          :on-success="uploadImage1"
          list-type="picture-card"
          class="avatar-uploader"
          accept=".jpg,.jpeg,.png,.gif">
          <img v-if="dataForm.imgUrl1" :src="dataForm.imgUrl1" class="avatar" width="200px">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item label="图片2" prop="imgUrl2" style="width:33%">
        <el-upload
          :headers="headers"
          :action="uploadPath"
          :show-file-list="false"
          :on-success="uploadImage2"
          list-type="picture-card"
          class="avatar-uploader"
          accept=".jpg,.jpeg,.png,.gif">
          <img v-if="dataForm.imgUrl2" :src="dataForm.imgUrl2" class="avatar" width="200px">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item label="图片3" prop="imgUrl3" style="width:33%">
        <el-upload
          :headers="headers"
          :action="uploadPath"
          :show-file-list="false"
          :on-success="uploadImage3"
          list-type="picture-card"
          class="avatar-uploader"
          accept=".jpg,.jpeg,.png,.gif">
          <img v-if="dataForm.imgUrl3" :src="dataForm.imgUrl3" class="avatar" width="200px">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>

      <el-form-item label="名称" prop="name" class="list-item">
        <el-input v-model="dataForm.name"/>
      </el-form-item>
      <el-form-item label="市场价格" prop="marketPrice" class="list-item">
        <el-input v-model="dataForm.marketPrice"/>
      </el-form-item>
      <el-form-item label="成本价格" prop="costPrice" class="list-item">
        <el-input v-model="dataForm.costPrice"/>
      </el-form-item>

      <el-form-item label="描述" prop="desc" class="list-item">
        <el-input v-model="dataForm.desc"/>
      </el-form-item>

      <el-form-item label="参与开始时间" prop="startTime" class="list-item">
        <div class="block">
          <el-date-picker
            v-model="dataForm.startTime"
            type="datetime"
            style="width:100%"
            placeholder="选择日期"/>
        </div>
      </el-form-item>
      <el-form-item label="参与截止时间" prop="endTime" class="list-item">
        <div class="block">
          <el-date-picker
            v-model="dataForm.endTime"
            type="datetime"
            style="width:100%"
            placeholder="选择日期"/>
        </div>
      </el-form-item>
      <el-form-item label="开奖时间" prop="drawTime" class="list-item">
        <div class="block">
          <el-date-picker v-model="dataForm.drawTime" style="width:100%" type="datetime" placeholder="选择日期" />
        </div>
      </el-form-item>

      <el-form-item label="显示奖品价值" prop="displayState" class="list-item">
        <el-radio-group v-model="dataForm.displayState">
          <el-radio label="0" >下架</el-radio>
          <el-radio label="1" >上架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="最低参与人数" prop="limitCountMin" class="list-item">
        <el-input v-model="dataForm.limitCountMin"/>
      </el-form-item>
      <el-form-item label="最大参与人数" prop="limitCountMax" class="list-item">
        <el-input v-model="dataForm.limitCountMax"/>
      </el-form-item>
      <el-form-item label="限制条件" prop="limitType" class="list-item">
        <el-radio-group v-model="dataForm.limitType">
          <el-radio label="0" >无限制条件</el-radio>
          <el-radio label="1" >看广告</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="抽奖类型" prop="activityType" class="list-item">
        <el-radio-group v-model="dataForm.activityType">
          <el-radio label="1" >限时</el-radio>
          <el-radio label="2" >限时限人</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="初始参与人数" prop="playerCountInit" class="list-item">
        <el-input v-model="dataForm.playerCountInit"/>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button @click="$router.push('/activity/prize')">取消</el-button>
      <el-button type="primary" @click="createData">确定</el-button>
    </div>
  </div>
</template>

<script>
import { createPrize, updatePrize, prizeDetail } from '@/api/prize'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      dataForm: {
        name: '',
        marketPrice: '',
        costPrice: '',
        imgUrl1: '',
        imgUrl2: '',
        imgUrl3: '',
        desc: '',
        startTime: '',
        endTime: '',
        drawTime: '',
        displayState: '0',
        limitCountMin: '',
        limitCountMax: '',
        limitType: '1',
        activityType: '1',
        playerCountInit: ''
      },
      uploadPath: process.env.BASE_API + '/file/upload',
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
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
    },
    kid() {
      return this.$route.query.kid || false
    },
    routerState() {
      if (this.$route.path === '/activity/prize/edit') {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    if (this.routerState) {
      prizeDetail({ kid: this.kid }).then(data => {
        this.dataForm = data.data.data
      }).catch(err => {
        this.$message.error(err.data.errmsg)
      })
    }
  },
  methods: {
    uploadImage1: function(response) {
      this.dataForm.imgUrl1 = response.data
    },
    uploadImage2: function(response) {
      this.dataForm.imgUrl2 = response.data
    },
    uploadImage3: function(response) {
      this.dataForm.imgUrl3 = response.data
    },
    createData() {
      if (this.routerState) {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            updatePrize(this.dataForm)
              .then(() => {
                this.$message.success('更新成功')
                this.$router.push('/activity/prize')
              })
              .catch(err => {
                this.$message.error(err.data.errmsg)
              })
          }
        })
      } else {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            createPrize(this.dataForm)
              .then(data => {
                this.$message.success('添加成功')
                this.$router.push('/activity/prize')
              })
              .catch(err => {
                this.$message.error(err.data.errmsg)
              })
          }
        })
      }
    }
  }
}
</script>
<style scoped>
.app-container{
  padding: 30px 20px 50px;
}
.from-list{
  display: flex;
  flex-wrap: wrap;
}
.list-item{
  width: 50%;
}
.list-item:nth-child(2n){
  padding-right: 40px;
}
.list-item:nth-child(2n-1){
  padding-left: 40px;
}
.avatar{
  width: 148px;
  height: 148px;
}
.footer{
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>
