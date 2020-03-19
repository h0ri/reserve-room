import moment from 'moment'
import axios from 'axios'
axios.defaults.baseURL = process.env.API

export default {
  name: 'calendar',
  data () {
    return {
      events: [],
      config: {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        defaultView: 'timelineWeek',
        defaultDate: moment(),
        header: {
          left: 'prev,next',
          center: '',
          right: 'timelineDay,timelineWeek'
        },
        resourceLabelText: 'Rooms',
        resources: [
          {
            id: '1',
            title: '会議室'
          },
          {
            id: '2',
            title: 'ソファースペース'
          }
        ],
        dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
        dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
        buttonText: {
          today: '今日',
          month: '月',
          week: '週',
          day: '日'
        },
        timeFormat: {
          '': 'H:mm'
        },
        columnFormat: {
          month: 'MM/D, dddd',
          week: 'D[(]ddd[)]',
          day: 'D ddd'
        }
      },
      isModal: false,
      modal: {
        title: '',
        type: ''
      },
      new_event: {},
      company: [
        { value: undefined, text: '所属' },
        { value: 'SION', text: 'SION' },
        { value: 'prd', text: 'prd' }
      ],
      priority: [
        { value: undefined, text: '重要度' },
        { value: '低い（社内）', text: '低い（社内）' },
        { value: '高い（クライアント）', text: '高い（クライアント）' }
      ],
      updating: false,
      loading: true
    }
  },
  mounted () {
    this.onInit()
  },
  methods: {
    onInit () {
      this.loading = true
      this.events = []

      axios.get('/reservations')
        .then(response => {
          let events = []

          response.data.forEach(item => {
            events.push({
              title: item.title,
              name: item.name,
              resourceId: item.resourceId,
              start: moment(item.start),
              end: moment(item.end),
              priority: item.priority,
              company: item.company,
              reserveId: item.reserveId
            })
          })

          this.events = events
          this.loading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    eventSelected (data) {
      this.modal = {
        title: '予約の確認',
        type: '3',
        data
      }
      this.isModal = true
    },
    eventCreated (data) {
      console.log(data.start.format())
      this.new_event = {
        title: '',
        resourceId: data.resource.id,
        start: data.start,
        end: data.end
      }
      this.modal = {
        title: '会議室の予約',
        type: '1',
        data
      }
      this.isModal = true
    },
    eventDrop (data) {
      this.modal = {
        title: '予約の変更',
        type: '2',
        data
      }
      this.isModal = true
    },
    eventResize (data) {
      this.modal = {
        title: '予約の変更',
        type: '2',
        data
      }
      this.isModal = true
    },
    setEvent () {
      this.updating = true

      let entity = this.new_event
      entity.title = this.new_event.company + ' ' + this.new_event.title
      this.events.push(entity)

      let body = {
        company: this.new_event.company,
        start: this.modal.data.start.format(),
        end: this.modal.data.end.format(),
        resourceId: this.new_event.resourceId,
        title: this.new_event.title,
        name: this.new_event.name,
        priority: this.new_event.priority
      }

      axios.post('/reservations', body)
        .then(response => {
          this.onInit()
          this.isModal = false
          this.updating = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    updateEvent () {
      this.updating = true

      let body = {
        company: this.modal.data.company,
        start: this.modal.data.start.format(),
        end: this.modal.data.end.format(),
        resourceId: this.modal.data.resourceId,
        title: this.modal.data.title,
        name: this.modal.data.name,
        priority: this.modal.data.priority,
        type: 'update'
      }

      axios.patch(`/reservations/${this.modal.data.reserveId}`, body)
        .then(response => {
          this.onInit()
          this.isModal = false
          this.updating = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    removeEvent () {
      this.updating = true

      let body = {
        company: this.modal.data.company,
        start: this.modal.data.start.format(),
        end: this.modal.data.end.format(),
        resourceId: this.modal.data.resourceId,
        title: this.modal.data.title,
        name: this.modal.data.name,
        priority: this.modal.data.priority,
        type: 'remove'
      }

      axios.patch(`/reservations/${this.modal.data.reserveId}`, body)
        .then(response => {
          this.onInit()
          this.isModal = false
          this.updating = false
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
