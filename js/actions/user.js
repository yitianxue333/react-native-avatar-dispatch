
import type { Action } from './types';

export const SET_USER = 'SET_USER';

export function setUser(user:string):Action {
  return {
    type: SET_USER,
    payload: user,
  };
}

export function login(data):Action {
    return {
        type: 'Login_Data',
        data: data
    }
}

export function timesheet_change(data):Action {
    return (dispatch, getState)=> {
        dispatch(timesheetItem_change({data: data}));
    }
}

export function timesheetItem_change({data}){
    return {
        type: 'Timesheet_Item_change',
        data: data
    }
}

export function timesheet(data):Action {
    return {
        type: 'Timesheet',
        data: data
    }
}

export function send_timesheetItem(data):Action {
    return (dispatch, getState)=> {
        dispatch(timesheetItem({data: data}));
    }
}

export function timesheetItem({data}){
    return {
        type: 'Timesheet_Item',
        data: data
    }
}

export function send_clientData(data):Action {
    return {
        type: 'Client_data',
        data: data
    }
}

export function send_edited_clientData(data):Action {
    return {
        type: 'Client_Edited_data',
        data: data
    }
}

export function send_EditedpropertyData(data, index, flag):Action {
    return {
        type: 'Property_Edited_data',
        data: data,
        index: index,
        flag: flag
    }
}

export function send_EditedpropertyData_From_Quote(data):Action {
    return {
        type: 'Property_Edited_data_from_Quote',
        data: data,
    }
}

export function add_NewProperty(data):Action {
    return {
        type: 'add_NewProperty',
        data: data,
    }
}

export function send_EditedpropertyData_New(flag):Action {
    return {
        type: 'Property_Edited_data_New',
        data: flag
    }
}

export function from_client_to_NewQuote(flag):Action {
    return {
        type: 'from_client_to_NewQuote',
        data: flag
    }
}

export function from_client_to_NewJob(flag):Action {
    return {
        type: 'from_client_to_NewJob',
        data: flag
    }
}

export function send_quoteData(data):Action {
    return {
        type: 'Quote_data',
        data: data
    }
}

export function send_clientData_from_quote(data):Action {
    return {
        type: 'send_clientData_from_quote',
        data: data
    }
}

export function from_quote_to_editProperty(flag):Action {
    return {
        type: 'from_quote_to_editProperty',
        data: flag
    }
}

export function update_property_from_newProperty_to_quotePage(data):Action {
    return {
        type: 'update_property_from_newProperty_to_quotePage',
        data: data
    }
}

export function send_taskData(data):Action {
    return {
        type: 'send_taskData',
        data: data
    }
}

export function from_taskDetail_to_clientPage(data):Action {
    return {
        type: 'from_taskDetail_to_clientPage',
        data: data
    }
}

export function send_jobData(data):Action {
    return {
        type: 'send_jobData',
        data: data
    }
}

export function send_visitData(data):Action {
    return {
        type: 'send_visitData',
        data: data
    }
}

export function from_home_clientPage(data):Action {
    return {
        type: 'from_home_clientPage',
        data: data
    }
}

export function send_data_from_home_eventPage(data):Action {
    return {
        type: 'send_data_from_home_eventPage',
        data: data
    }
}

export function send_data_from_home_visitPage(data):Action {
    return {
        type: 'send_data_from_home_visitPage',
        data: data
    }
}

export function send_jobData_from_visit(data):Action {
    return {
        type: 'send_jobData_from_visit',
        data: data
    }
}

export function send_data_from_home_taskPage(data):Action {
    return {
        type: 'send_data_from_home_taskPage',
        data: data
    }
}

export function change_loginData(data):Action {
    return {
        type: 'change_loginData',
        data: data
    }
}

export function is_start_stop_location(data):Action {
    return {
        type: 'is_start_stop_location',
        data: data
    }
}


// export function start_location(data):Action {
//     console.log('======999999999999999999999999999999 =======', data)
//         setInterval( () => {
//             console.log('======TEMP TOKEN =======', data)
//             navigator.geolocation.getCurrentPosition(
//             (position) => {

//                 fetch('http://192.168.100.179/api/v1/user/location/update', {
//                     method: 'POST',
//                     headers: {
//                         'Accept': 'application/json',
//                         'Content-Type': 'application/json',
//                         'Access-Token': data
//                     },
//                     body: JSON.stringify({
//                         latitude: position.coords.latitude,
//                         longitude: position.coords.longitude
//                     })
//                 })
//                     .then((response) => response.json())
//                     .then((responseData) => {
//                         console.log('======Update location success =======')
//                 })
//             },
//             (error) => console.log('======Update location error =======', error),
//             { enableHighAccuracy: true, timeout: 20000 },
//           );
//         }, 1000)
// }