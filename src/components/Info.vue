<template>
  <div>
    <v-container grid-list-md>
      <v-layout justify-center row wrap>
        <v-flex sm12 md10 lg6>
          <v-card>
            <v-card-title primary-title>
              <v-container grid-list-md>
                <v-layout row wrap>
                  <v-flex md12 class="text-md-center">
                    <h3 class="headline mb-0">Dapp acl</h3>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout row wrap>
                  <v-flex md6 class="text-md-center" style="border-right:1px solid #707070">
                    <v-btn
                      :loading="loadingCreate"
                      :disabled="loadingCreate"
                      color="primary"
                      @click.native="createAcl"
                    >
                      Create ACL
                    </v-btn>
                    <v-alert
                      v-if="createError!==''"
                      :value="true"
                      type="error"
                    >
                      {{createError}}
                    </v-alert>
                    <v-alert
                      v-if="createSuccess!==''"
                      :value="true"
                      type="success"
                    >
                      {{createSuccess}}
                    </v-alert>
                  </v-flex>
                  <v-flex md6 class="text-md-center" style="padding-left: 15px;">
                    <v-form ref="form" v-model="valid">
                      <v-text-field
                        v-model="address"
                        :rules="requireRule"
                        label="Address ACL"
                        required
                      ></v-text-field>
                      <v-btn
                        :loading="loadingView"
                        :disabled="loadingView"
                        color="primary"
                        @click.native="viewAcl"
                      >
                        View ACL
                      </v-btn>
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
import SimpleACLFactoryABI from '../abi/SimpleACLFactory.json'
import { watchTx } from '../utils/utils'
import { FACTORY, GAS_PRICE } from '../config'

export default {
  data () {
    return {
      loadingCreate: false,
      createError: '',
      createSuccess: '',
      loadingView: false,
      valid: false,
      address: '',
      requireRule: [
        v => !!v || 'Field required',
        v => v.length === 42 || 'Bad address'
      ]
    }
  },
  methods: {
    createAcl () {
      this.createError = ''
      this.createSuccess = ''
      this.loadingCreate = true
      const factory = web3.eth.contract(SimpleACLFactoryABI).at(FACTORY)
      const newAclEvent = factory.NewACL()
      newAclEvent.watch((error, result) => {
        if (error) {
          return
        }
        this.loadingCreate = false
        this.createSuccess = 'New ACL: ' + result.args.acl
        newAclEvent.stopWatching()
      })
      factory.create({from: web3.eth.accounts[0], gas: '1000000', gasPrice: GAS_PRICE}, (e, r) => {
        if (e) {
          this.loadingCreate = false
          this.createError = 'Error'
          return
        }
        watchTx(r)
          .then(() => {
            console.log('tx ok')
          })
          .catch(() => {
            this.createError = 'Error'
            this.loadingCreate = false
          })
      })
    },
    viewAcl () {
      if (this.$refs.form.validate()) {
        this.$router.push({ name: 'view', params: { address: this.address } })
      }
    }
  }
}
</script>
