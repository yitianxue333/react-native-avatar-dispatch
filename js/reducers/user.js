
import type { Action } from '../actions/types';
import { SET_USER } from '../actions/user';

export type State = {
    name: string,
    timesheet_item: {},
    login_data:{},
    timesheet_data: {array:[]},
    timesheet_temp_data: [],
    sendTimesheet_item: {},
    client_data:null,
    client_edited_data: {},
    property_edited_data: {},
    property_edited_index: 0,
    property_is_new: undefined,
    from_client_to_NewQuote: false,
    from_client_to_NewJob: false,
    quote_data: {},
    from_quote_to_editProperty: false,
    task_data: {},
    job_data: {},
    visit_data: {},
    event_data: {},
    is_start_stop_location: ""
}

const initialState = {
  name: '',
  timesheet_item: {},
  login_data:{},
  timesheet_data: {array:[]},
  timesheet_temp_data: [],
  sendTimesheet_item: {},
  client_data: null,
  client_edited_data: {},
  property_edited_data: {},
  property_edited_index: 0,
  property_is_new: undefined,
  from_client_to_NewQuote: false,
  from_client_to_NewJob: false,
  quote_data: {},
  from_quote_to_editProperty: false,
  task_data: {},
  job_data: {},
  visit_data: {},
  event_data: {},
  is_start_stop_location: ""
};

export default function (state:State = initialState, action:Action): State {
  if (action.type === SET_USER) {
    return {
      ...state,
      name: action.payload,
    };
  }

  if (action.type === 'Login_Data') {
    return {
      ...state,
      login_data: action.data
    };
  }

  if (action.type === 'Timesheet') {
    return {
      ...state,
      timesheet_data: action.data
    };
  }

  if (action.type === 'Timesheet_Item') {
    return {
      ...state,
      sendTimesheet_item: action.data,
    };
  }

  if (action.type === 'Timesheet_Item_change') {
    var temp = state.timesheet_data;
    var new_totalDuration = 0;
    temp.array[action.data.index] = action.data.data ;
    temp.array.map((data) => {
      new_totalDuration += data.duration
    })
    temp.total_duration = new_totalDuration

    return {
      ...state,
      timesheet_data: temp
    };
  }

  if (action.type === 'Client_data') {
    if (state.client_data != null) {
      client_data = null
    }
    return {
      ...state,
      client_data: action.data,
    };
  }
  
  if (action.type === 'Client_Edited_data') {
    return {
      ...state,
      client_edited_data: action.data,
    };
  }

  if (action.type === 'Property_Edited_data') {
    var temp = state.client_data;
    if (action.flag == false) {
      temp.property[action.index] = action.data
    } else {
      temp.property.push(action.data)
    }
    return {
      ...state,
      client_data: temp,
      property_edited_data: action.data,
      property_edited_index: action.index
    };
  }

  if (action.type === 'Property_Edited_data_from_Quote') {
    if (state.property_edited_data != null) {
      property_edited_data = null
    }
    return {
      ...state,
      property_edited_data: action.data,
    };
  }

  if (action.type === 'add_NewProperty') {
    var temp = state.client_data;
    temp.property.push(action.data)
    return {
      ...state,
      client_data: temp,
    };
  }

  if (action.type === 'Property_Edited_data_New') {
    return {
      ...state,
      property_is_new: action.data,
    };
  }

  if (action.type === 'from_client_to_NewQuote') {
    return {
      ...state,
      from_client_to_NewQuote: action.data
    };
  }

  if (action.type === 'from_client_to_NewJob') {
    return {
      ...state,
      from_client_to_NewJob: action.data
    };
  }

  if (action.type === 'Quote_data') {
    if (state.quote_data != null) {
      quote_data = null
    }
    return {
      ...state,
      quote_data: action.data,
    };
  }

  if (action.type === 'send_clientData_from_quote') {
    if (state.client_data != null) {
      client_data = null
    }
    return {
      ...state,
      client_data: action.data,
    };
  }

  if (action.type === 'from_quote_to_editProperty') {
    return {
      ...state,
      from_quote_to_editProperty: action.data
    };
  }

  if (action.type === 'update_property_from_newProperty_to_quotePage') {
    var temp = state.quote_data;
    temp.property_data = action.data
    return {
      ...state,
      quote_data: temp
    };
  }

  if (action.type === 'send_taskData') {
    if (state.task_data != null) {
      task_data = null
    }
    return {
      ...state,
      task_data: action.data,
    };
  }

  if (action.type === 'from_taskDetail_to_clientPage') {
    if (state.client_data != null) {
      client_data = null
    }
    return {
      ...state,
      client_data: action.data,
    };
  }

  if (action.type === 'send_jobData') {
    return {
      ...state,
      job_data: action.data,
    };
  }

  if (action.type === 'send_visitData') {
    return {
      ...state,
      visit_data: action.data,
    };
  }

  if (action.type === 'from_home_clientPage') {
    if (state.client_data != null) {
      client_data = null
    }
    return {
      ...state,
      client_data: action.data,
    };
  }

  if (action.type === 'send_data_from_home_eventPage') {
    return {
      ...state,
      event_data: action.data,
    };
  }

  if (action.type === 'send_data_from_home_visitPage') {
    if (state.visit_data != null) {
      visit_data = null
    }
    return {
      ...state,
      visit_data: action.data,
    };
  }

  if (action.type === 'send_jobData_from_visit') {
    if (state.job_data != null) {
      job_data = null
    }
    return {
      ...state,
      job_data: action.data,
    };
  }

  if (action.type === 'send_data_from_home_taskPage') {
    if (state.task_data != null) {
      task_data = null
    }
    return {
      ...state,
      task_data: action.data,
    };
  }

  if (action.type === 'change_loginData') {
    if (state.login_data != null) {
      login_data = null
    }
    return {
      ...state,
      login_data: action.data,
    };
  }

  if (action.type === 'is_start_stop_location') {
    return {
      ...state,
      is_start_stop_location: action.data,
    };
  }
  
  

  return state;
}
