import { Injectable } from '@angular/core';

declare var require: any;
const axios = require('axios').default;
// import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = 'application/json'; // for POST requests
const apiUrl = "https://api.samantapp.com/api/";

// axios.interceptors.request.use(
//   request => {
//     // console.log('timezone');
//   }, 
//   error => {
//     return Promise.reject(error);
//   }
// );
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  	constructor() {
  		var token = localStorage.getItem('token');
      	if(token){
        	axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
      	}
  	}

    getAppVer(){
      return axios.get(apiUrl + 'auth/get-app-ver')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

  	registerUser(data){
  		return axios.post(apiUrl + 'auth/register', data)
	    .then(function(response){
	      return response.data;
	    })
	    .catch(function(err){
	      return Promise.reject(err)
	    });
  	}

    startCall(data){
      return axios.post(apiUrl + 'other/start-call', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    receiverEnabled(data){
      
      return axios.post(apiUrl + 'other/receiver-enabled', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });

    }

    sendFireMsg(data){
      return axios.post(apiUrl + 'other/send-fire-msg', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    sendCallLog(data){
      return axios.post(apiUrl + 'send-call-log', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    setFav(data){
      return axios.post(apiUrl + 'auth/set-fav', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }


    uploadDp(data){
      return axios.post(apiUrl + 'auth/register-company', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    registerCompany(data){
      return axios.post(apiUrl + 'auth/register-company', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    sendOtp(data){
      return axios.post(apiUrl + 'otp/send', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }


    changeDp(data){
      return axios.post(apiUrl + 'auth/upload-user-photo', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    verifyOtp(data){
      return axios.post(apiUrl + 'otp/verify', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    verifyOtpAndReset(data){
      return axios.post(apiUrl + 'otp/verify-and-reset', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

  	loginUser(data){
  		return axios.post(apiUrl + 'auth/login', data)
	    .then(function(response){
	      return response.data;
	    })
	    .catch(function(err){
	      return Promise.reject(err)
	    });
  	}


    setUserFbToken(data){
      return axios.post(apiUrl + 'auth/update-fbs-token', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getUser(){
      
        var jan = new Date( 2009, 0, 1, 2, 0, 0 ), jul = new Date( 2009, 6, 1, 2, 0, 0 );
        var offset = ( jan.getTime() % 24 * 60 * 60 * 1000 ) > ( jul.getTime() % 24 * 60 * 60 * 1000 )?jan.getTimezoneOffset() : jul.getTimezoneOffset();
        var data = {
          'time_offset': offset
        };
      return axios.post(apiUrl + 'auth/user-profile', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    sendPwCode(data){
      return axios.post(apiUrl+'auth/send-pw-code', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err);
      });
    }

    changePw(data){
      return axios.post(apiUrl+'auth/change-pw', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err);
      });
    }

    changePwAuth(data){
      return axios.post(apiUrl+'auth/change-pw-auth', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err);
      });
    }

    logoutUser(){
      return axios.post(apiUrl + 'auth/logout')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    deleteCurrentUser(){
      return axios.post(apiUrl + 'auth/deleteCurrentUser')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getLanguages(){
      return axios.get(apiUrl + 'other/get-languages')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getPlans(){
      return axios.get(apiUrl + 'other/get-plans')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getCompanyTypes(){
      return axios.get(apiUrl + 'other/get-company-types')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getProviders(data){
      return axios.post(apiUrl + 'user/get-service-providers', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getFavProviders(){
      return axios.post(apiUrl + 'user/get-fav-providers')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    addLanguages(data){
      return axios.post(apiUrl + 'user/add-language', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }
    
    getProviderData(){
      return axios.get(apiUrl + 'user/service-provider-data')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getProviderDets(id){
      return axios.get(apiUrl + 'user/show-service-provider/'+id)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getMemberDets(id){
      var data = {
        'user_id': id
      };
      return axios.post(apiUrl + 'company/get-member-detail', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getFundRequests(){
      return axios.post(apiUrl + 'company/get-fund-requests')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }
    appDecRequests(data){
      return axios.post(apiUrl + 'company/app-dec-requests', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getNotes(){
      return axios.get(apiUrl + 'user/get-notifications')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getMoreNotes(data){
      return axios.post(apiUrl + 'user/get-more-notifications', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getMoreReviews(data){
      return axios.post(apiUrl + 'user/get-more-reviews', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getWalletTransactions(){
      return axios.get(apiUrl + 'other/get-wallet-transactions')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    loadMoreTransaction(data){
      return axios.post(apiUrl + 'other/load-more-transaction', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getFaqs(){
      return axios.get(apiUrl + 'other/get-faq')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    hire(data){
      return axios.post(apiUrl + 'user/hire', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getUpcomingCalls(showAll = 0, data = {}){
      return axios.post(apiUrl + 'user/upcoming-calls?showAll='+showAll, data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getOrderDetails(data){
      return axios.post(apiUrl + 'user/order-details', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    acceptOrder(data){
      return axios.post(apiUrl + 'user/accept-order', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    hireTimeComplete(data){
      return axios.post(apiUrl + 'user/hire-time-complete', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getActivities(data){
      return axios.post(apiUrl + 'user/get-activities', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    loadMoreActivities(data){
      return axios.post(apiUrl + 'user/load-more-activities', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getAvail(){
      return axios.get(apiUrl + 'user/get-avail')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    delAvail(id){
      return axios.get(apiUrl + 'user/del-avail/'+id)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    doPayment(data){
      return axios.post(apiUrl + 'other/do-payment', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    withdrawPayment(data){
      return axios.post(apiUrl + 'other/withdraw-payment', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    connectWithStripe(){
      return axios.post(apiUrl + 'other/connect-stripe')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }


    addMember(data){
      return axios.post(apiUrl + 'company/add-company-user', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getMembers(){
      return axios.get(apiUrl + 'company/get-member-list')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    deleteMultiMembers(data){
      return axios.post(apiUrl + 'company/delete-member-list', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    deleteMember(data){
      return axios.post(apiUrl + 'company/delete-member-list', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }


    addFundsToMember(data){
      return axios.post(apiUrl + 'company/add-funds-to-member', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    enableDisableUser(data){
      return axios.post(apiUrl + 'user/enable-disable-user', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    endCall(){

    }

    cancelOrder(data){
      return axios.put(apiUrl + 'user/cancel-order', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    updateOrder(data){
      return axios.post(apiUrl + 'user/update-order', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    extendCall(id){
      return axios.post(apiUrl + 'user/extend-call/'+id)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getCallSummary(id){
      return axios.get(apiUrl + 'user/call-summary/'+id)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }



    addReview(id, data){
      return axios.post(apiUrl + 'user/add-review/'+id, data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    updateReviewResponse(data){
      return axios.put(apiUrl + 'user/update-review-response', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
      // update-review-response
    }

    updateUser(data){
      return axios.post(apiUrl + 'user/update-profile', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }
    addUnavailable(data){
      return axios.post(apiUrl + 'user/add-unavailabelity', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }
    deleteUnavailable(data){
      return axios.post(apiUrl + 'user/delete-unavailabelity', data)
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getPopupEvents(){
      return axios.get(apiUrl + 'user/get-popup-events')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }

    getUnavailable(){
      return axios.post(apiUrl + 'user/get-unavailabelity')
      .then(function(response){
        return response.data;
      })
      .catch(function(err){
        return Promise.reject(err)
      });
    }
}
