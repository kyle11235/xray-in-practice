<template>
  <div class="dashboard-editor-container">

    <el-row :gutter="40" class="panel-group">
      
      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('messages')">
          <div class="card-panel-description">
            <div class="card-panel-text">Total</div>
            <count-to :start-val="0" :end-val="total" :duration="3000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>


      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-description">
            <div class="card-panel-text">Approved</div>
            <count-to :start-val="0" :end-val="approved" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-description">
            <div class="card-panel-text">Denied</div>
            <count-to :start-val="0" :end-val="denied" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-description">
            <div class="card-panel-text">To handle</div>
            <count-to :start-val="0" :end-val="toHandle" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      
    </el-row>


  </div>
</template>

<script>
import { all, approved, denied } from '@/api/dashboard'
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      total: 0,
      approved: 0,
      denied: 0,
      toHandle: 0
    }
  },
  created() {
    all().then(res => {
      console.log("data=", res.data);
      this.total = res.data.art_body.range.total;
      this.toHandle = this.total - this.approved - this.denied;
    }).catch((e) => {
        console.error(e);
    })

    approved().then(res => {
      console.log("data=", res.data);
      this.approved = res.data.art_body.range.total;
      this.toHandle = this.total - this.approved - this.denied;
    }).catch((e) => {
        console.error(e);
    })

    denied().then(res => {
      console.log("data=", res.data);
      this.denied = res.data.art_body.range.total;
      this.toHandle = this.total - this.approved - this.denied;
    }).catch((e) => {
        console.error(e);
    })


  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.panel-group {
  margin-top: 18px;

  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      
      font-weight: bold;
      margin: 26px;
      
      text-align:center;


      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
