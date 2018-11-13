import React, { Component } from "react";
import Login from "../components/login/";
import Signup from "../components/signup/";
import SettingPage from "../components/SettingPage/";
import SettingEditPage from "../components/SettingEditPage/";
import Home from "../components/home/";
import TimesheetDetailPage from "../components/TimesheetDetailPage/";
import BlankPage from "../components/blankPage";
import IntroductPage from "../components/IntroductPage"
import AccountCheckerPage from "../components/accountCheckerPage";
import ItemDetailPage from "../components/ItemDetailPage";
import NewClientPage from "../components/NewClientPage";
import ClientPage from "../components/NewClientPage/Client/";
import ClientEditPage from "../components/NewClientPage/Client/EditPage";
import InvoicePage from "../components/InvoicePage";
import NewPropertyPage from "../components/NewClientPage/Client/NewPropertyPage";
import NewQuotePage from "../components/NewQuotePage";
import QuoteDetailPage from "../components/QuoteDetailPage";
import NewJobPage from "../components/NewJobPage";
import JobDetailPage from "../components/JobDetailPage";
import NewVisitPage from "../components/NewVisitPage";
import VisitDetailPage from "../components/VisitDetailPage";
import NewTaskPage from "../components/NewTaskPage";
import TaskDetailPage from "../components/TaskDetailPage";
import HomeDrawerRouter from "./HomeDrawerRouter";
import { StackNavigator } from "react-navigation";
import { Header, Left, Button, Icon, Body, Title, Right } from "native-base";
HomeDrawerRouter.navigationOptions = ({ navigation }) => ({
  header: null
});
export default (StackNav = StackNavigator({
  Login: { screen: Login },
  Signup: { screen: Signup },
  SettingPage: { screen: SettingPage },
  SettingEditPage: { screen: SettingEditPage },
  Home: { screen: Home },
  TimesheetDetailPage: { screen: TimesheetDetailPage },
  BlankPage: { screen: BlankPage },
  IntroductPage: { screen: IntroductPage },
  AccountCheckerPage: { screen: AccountCheckerPage },
  ItemDetailPage: { screen: ItemDetailPage },
  NewClientPage: { screen: NewClientPage },
  ClientPage: { screen: ClientPage },
  ClientEditPage: { screen: ClientEditPage },
  InvoicePage: { screen: InvoicePage },
  NewPropertyPage: { screen: NewPropertyPage },
  NewQuotePage: { screen: NewQuotePage },
  QuoteDetailPage: { screen: QuoteDetailPage },
  NewJobPage: { screen: NewJobPage },
  JobDetailPage: { screen: JobDetailPage },
  NewVisitPage: { screen: NewVisitPage },
  VisitDetailPage: { screen: VisitDetailPage },
  NewTaskPage: { screen: NewTaskPage },
  TaskDetailPage: { screen: TaskDetailPage },
}, { headerMode: 'none' }));
