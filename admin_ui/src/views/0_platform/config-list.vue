<template>
  <div class="app-container">

    
    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="searching..." border fit highlight-current-row>

      <el-table-column align="center"  label="Repo" prop="repo" sortable/>
      <el-table-column align="center" label="Path" prop="path"/>
      <el-table-column align="center" label="name" prop="name"/>

      <el-table-column align="center" label="操作" min-width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetails(scope.row)">Details</el-button>
          
        </template>
      </el-table-column>
    </el-table>


    <!-- 对话框 -->
    <el-dialog :visible.sync="showDetails" title="Meta Data">

      <el-table v-loading="" :data="detailsList" element-loading-text="searching..." border fit highlight-current-row>

      <el-table-column align="center"  label="Key" prop="key" sortable/>
      <el-table-column align="center" label="Value" prop="value"/>

    </el-table>

     
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="handleApprove()">Approve</el-button>
        <el-button type="danger" size="mini" @click="handleDeny()">Deny</el-button>
        <el-button @click="showDetails = false">Close</el-button>
      </div>
    </el-dialog>
    

  </div>
</template>

<script>
import { all, details, approve, deny} from '@/api/dashboard'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'config',
  components: { Pagination },
  data() {
    return {
      list: null,
      showDetails: false,
      detailsList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {


    getList() {
      this.listLoading = true
      all().then(response => {
        this.list = response.data.art_body.results
        this.total = response.data.art_body.range.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    
    handleDetails(row) {

      this.detailsList = []

      this.showDetails = true;
      this.currentRow = row;
      
      this.listLoading = true
      details({name:row.name}).then(response => {
        let properties = response.data.art_body.properties

        
        
        for(let key in properties){
              console.log(key + '=' + properties[key])
              this.detailsList.push({
                key:key,
                value:properties[key]
              })
        }

        
        this.listLoading = false
      }).catch(() => {
        this.details = []
        this.listLoading = false
      })
      
    },
    
    handleApprove() {

      approve({name: this.currentRow.name}).then(response => {
        this.handleDetails(this.currentRow)
      }).catch((e) => {
        console.log(e)
      })
      
    },
    handleDeny() {

      deny({name: this.currentRow.name}).then(response => {
        this.handleDetails(this.currentRow)
      }).catch((e) => {
        console.log(e)
      })
      
    },
  }
}
</script>
