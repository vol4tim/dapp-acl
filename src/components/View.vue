<template>
  <div>
    <v-container grid-list-md>
      <v-layout justify-center row wrap>
        <v-flex sm12 md10>
          <v-card>
            <v-card-title primary-title>
              <v-container grid-list-md>
                <v-layout row wrap>
                  <v-flex md12 class="text-md-center">
                    <h3 class="headline mb-0">ACL: {{address}}</h3>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout row wrap>
                  <v-flex md12 class="text-md-center">
                    <v-form ref="formCheck" v-model="check.valid">
                      <v-text-field
                        v-model="check.address"
                        :rules="requireRule"
                        label="Check address"
                        required
                      ></v-text-field>
                      <v-btn
                        :loading="check.loading"
                        :disabled="check.loading"
                        color="primary"
                        @click.native="onCheck"
                      >
                        Check
                      </v-btn>
                      <v-alert
                        v-if="check.error!==''"
                        :value="true"
                        type="error"
                      >
                        {{check.error}}
                      </v-alert>
                      <v-alert
                        v-if="check.warning!==''"
                        :value="true"
                        type="warning"
                      >
                        {{check.warning}}
                      </v-alert>
                      <v-alert
                        v-if="check.success!==''"
                        :value="true"
                        type="success"
                      >
                        {{check.success}}
                      </v-alert>
                    </v-form>
                    <v-divider class="my-3" />
                    <v-form ref="formAdd" v-model="add.valid">
                      <v-text-field
                        v-model="add.address"
                        :rules="requireRule"
                        label="Add address"
                        required
                      ></v-text-field>
                      <v-btn
                        :loading="add.loading"
                        :disabled="add.loading"
                        color="primary"
                        @click.native="onAdd"
                      >
                        Add
                      </v-btn>
                      <v-alert
                        v-if="add.error!==''"
                        :value="true"
                        type="error"
                      >
                        {{add.error}}
                      </v-alert>
                      <v-alert
                        v-if="add.warning!==''"
                        :value="true"
                        type="warning"
                      >
                        {{add.warning}}
                      </v-alert>
                      <v-alert
                        v-if="add.success!==''"
                        :value="true"
                        type="success"
                      >
                        {{add.success}}
                      </v-alert>
                    </v-form>
                    <v-divider class="my-3" />
                    <v-form ref="formRemove" v-model="remove.valid">
                      <v-text-field
                        v-model="remove.address"
                        :rules="requireRule"
                        label="Remove address"
                        required
                      ></v-text-field>
                      <v-btn
                        :loading="remove.loading"
                        :disabled="remove.loading"
                        color="primary"
                        @click.native="onRemove"
                      >
                        Remove
                      </v-btn>
                      <v-alert
                        v-if="remove.error!==''"
                        :value="true"
                        type="error"
                      >
                        {{remove.error}}
                      </v-alert>
                      <v-alert
                        v-if="remove.warning!==''"
                        :value="true"
                        type="warning"
                      >
                        {{remove.warning}}
                      </v-alert>
                      <v-alert
                        v-if="remove.success!==''"
                        :value="true"
                        type="success"
                      >
                        {{remove.success}}
                      </v-alert>
                    </v-form>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import SimpleACLABI from '../abi/SimpleACL.json'
import { watchTx } from '../utils/utils'
import { GAS_PRICE } from '../config'

export default {
  props: ['address'],
  data () {
    return {
      check: {
        error: '',
        success: '',
        warning: '',
        loading: false,
        valid: false,
        address: ''
      },
      add: {
        error: '',
        success: '',
        warning: '',
        loading: false,
        valid: false,
        address: ''
      },
      remove: {
        error: '',
        success: '',
        warning: '',
        loading: false,
        valid: false,
        address: ''
      },
      requireRule: [
        v => !!v || 'Field required',
        v => v.length === 42 || 'Bad address'
      ]
    }
  },
  methods: {
    onCheck () {
      this.check.error = ''
      this.check.warning = ''
      this.check.success = ''
      if (this.$refs.formCheck.validate()) {
        this.check.loading = true
        const acl = web3.eth.contract(SimpleACLABI).at(this.address)
        acl.isMember(this.check.address, (e, r) => {
          this.check.loading = false
          if (e) {
            this.check.error = 'Error'
            return
          }
          if (r) {
            this.check.success = 'True'
          } else {
            this.check.warning = 'False'
          }
        })
      }
    },
    onAdd () {
      this.add.error = ''
      this.add.warning = ''
      this.add.success = ''
      if (this.$refs.formAdd.validate()) {
        this.add.loading = true
        const acl = web3.eth.contract(SimpleACLABI).at(this.address)
        acl.add(this.add.address, {from: web3.eth.accounts[0], gas: '1000000', gasPrice: GAS_PRICE}, (e, r) => {
          if (e) {
            this.add.loading = false
            this.add.error = 'Error'
            return
          }
          watchTx(r)
            .then(() => {
              this.add.success = 'Success'
              this.add.loading = false
            })
            .catch(() => {
              this.add.loading = false
              this.add.error = 'Error'
            })
        })
      }
    },
    onRemove () {
      this.remove.error = ''
      this.remove.warning = ''
      this.remove.success = ''
      if (this.$refs.formRemove.validate()) {
        this.remove.loading = true
        const acl = web3.eth.contract(SimpleACLABI).at(this.address)
        acl.remove(this.remove.address, {from: web3.eth.accounts[0], gas: '1000000', gasPrice: GAS_PRICE}, (e, r) => {
          if (e) {
            this.remove.loading = false
            this.remove.error = 'Error'
            return
          }
          watchTx(r)
            .then(() => {
              this.remove.success = 'Success'
              this.remove.loading = false
            })
            .catch(() => {
              this.remove.loading = false
              this.remove.error = 'Error'
            })
        })
      }
    }
  }
}
</script>
