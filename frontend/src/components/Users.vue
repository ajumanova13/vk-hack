<template>
  <div id="pzdc">
    <div class="content">
        <div class="header">
          <router-link to="/filters">
            <div class="back">
                Фильтры
            </div>
          </router-link>
          <div class="title">Люди</div>
        </div>
    </div>
    <div class="users" v-show="isSuccess">
      <user v-for="ev in evs" 
        :id='ev.uid' 
        :firstName='ev.first_name' 
        :description='ev.description' 
        :similar='ev.similar' 
        :imageLink='ev.photo' 
        :key="ev.uid">    
      </user>
    </div>
  </div>
</template>

<script>
import User from './User.vue'
import GlobalStatus from '../common/global-status'
import { HTTP } from '../http/common'
import { mapState } from 'vuex'

export default {
  components: { User },
  name: 'Users',
  data () {
    return {
      loadingStatus: GlobalStatus.Trying,
      evs: []
    }
  },
  mounted () {
    this.loadEvents()
  },
  computed: {
    isTrying () {
      return this.loadingStatus === GlobalStatus.Trying
    },
    isSuccess () {
      return this.loadingStatus === GlobalStatus.Success
    },
    isFailed () {
      return this.loadingStatus === GlobalStatus.Failed
    },
    ...mapState(['event', 'filters', 'info', 'raw_api_result'])
  },
  methods: {
    formatUserDescription (user) {
      var seq = []

      let age = this.unwrapDate(user.bdate)
      if (age != null) {
        seq.push(age + ' лет')
      }
      if (user.city_name !== '') {
        seq.push(user.city_name)
      }
      if (user.occupation.name !== '') {
        seq.push(user.occupation.name)
      }

      return seq.join(' • ')
    },
    unwrapDate (str) {
      if (str === undefined) { return null }
      let parts = str.split('.')
      if (parts.length !== 3) {
        return null
      } else {
        let age = 2017 - new Date(str).getFullYear()
        return isNaN(age) ? null : age
      }
    },
    filterSugested (people) {
      return people.filter(e => {
        console.log(e.bdate)
        var isAgeOk = false
        let lowAge = this.filters.lowAge
        let highAge = this.filters.highAge
        let age = this.unwrapDate(e.bdate)
        if (lowAge == null && highAge == null) {
          isAgeOk = true
        } else if (lowAge != null && highAge != null && lowAge < highAge) {
          isAgeOk = age != null && lowAge <= age && age <= highAge
        } else if (lowAge != null) {
          isAgeOk = age != null && lowAge <= age
        } else {
          isAgeOk = age != null && age <= highAge
        }
        let isMale = this.filters.any || (e.sex === 2 && this.filters.male)
        let isFemale = this.filters.any || (e.sex === 1 && this.filters.female)
        let needPhoto = !this.filters.needPhoto || (e.photo !== '' && this.filters.needPhoto)
        let onlymyCity = !this.filters.onlymyCity || (e.city_name === this.info.api_result.city.title && this.filters.onlymyCity)
        console.log('isAgeOk', isAgeOk + ' ' + lowAge + ' ' + age + ' ' + highAge)
        return isAgeOk && e.first_name !== 'DELETED' && isMale && isFemale && needPhoto && onlymyCity
      })
    },
    loadEvents () {
      console.log(this.raw_api_result)
      console.log(this.event)
      HTTP.get('/users/', { params: {eventId: this.event, apiResult: this.raw_api_result} })
      .then(response => {
        console.log('before', response.data.result)
        let after = this.filterSugested(response.data.result).map(e => {
          if (e.occupation == null) {
            e.occupation = { name: '' }
          }
          e.description = this.formatUserDescription(e)
          return e
        })
        console.log('after', after)
        this.evs = after
        this.loadingStatus = GlobalStatus.Success
      })
      .catch(response => {
        console.log(response)
        console.log(this.filterSugested(this.evs))
        this.loadingStatus = GlobalStatus.Success
      })
    }
  }
}
</script>

<style>
body {
  font-size: 14px !important;
  font-weight: 400 !important;
}

.content {
    background-color: #FFFFFF;
    box-shadow: 0 0 1px rgba(0,0,0,0.3);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 8px;
}

.content .header {
    position: relative;
}

.content .header .back {
    display: inline-block;
    padding: 15px 20px 15px 36px;
    height: 19px;
    background: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%229%22%20height%3D%2216%22%20viewBox%3D%220%200%209%2016%22%3E%3Cpath%20fill%3D%22%23828A99%22%20d%3D%22M8%2015.9c-.2%200-.4-.1-.6-.3l-7-7c-.3-.3-.3-.9%200-1.2l7-7c.3-.3.9-.3%201.2%200%20.3.3.3.9%200%201.2l-6.4%206.4%206.4%206.4c.3.3.3.9%200%201.2-.2.2-.4.3-.6.3z%22%20opacity%3D%22.7%22%2F%3E%3C%2Fsvg%3E') 15px 16px no-repeat;
    color: #818d99;
    text-decoration: none;
    line-height: 19px;
    cursor: pointer;

    position: absolute;
    left: 0;
}

.content .header .back:hover {
    background: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%229%22%20height%3D%2216%22%20viewBox%3D%220%200%209%2016%22%3E%3Cpath%20fill%3D%22%23828A99%22%20d%3D%22M8%2015.9c-.2%200-.4-.1-.6-.3l-7-7c-.3-.3-.3-.9%200-1.2l7-7c.3-.3.9-.3%201.2%200%20.3.3.3.9%200%201.2l-6.4%206.4%206.4%206.4c.3.3.3.9%200%201.2-.2.2-.4.3-.6.3z%22%20opacity%3D%22.7%22%2F%3E%3C%2Fsvg%3E') 15px 16px no-repeat, linear-gradient(90deg, #f0f2f5 50%, #fff);
    color: #707d8c;
}

.content .header .title {
    text-align: center;
    font-weight: 700;
    color: #222;
    padding: 15px 20px;
}
</style>
