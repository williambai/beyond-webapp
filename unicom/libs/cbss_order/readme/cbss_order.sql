/*
SQLyog Ultimate v11.13 (64 bit)
MySQL - 5.5.18 : Database - cbss_order
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `b_city_account` */

DROP TABLE IF EXISTS `b_city_account`;

CREATE TABLE `b_city_account` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `province_id` varchar(11) NOT NULL COMMENT '省编码',
  `cbssaccount` varchar(20) DEFAULT NULL COMMENT 'cbss账号',
  `cbsspasswd` varchar(20) DEFAULT NULL COMMENT 'cbss密码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `b_city_account` */


/*Table structure for table `b_province_info` */

DROP TABLE IF EXISTS `b_province_info`;

CREATE TABLE `b_province_info` (
  `id` int(7) NOT NULL AUTO_INCREMENT COMMENT '省市id',
  `province_name` varchar(30) NOT NULL COMMENT '省市名',
  `province_id` varchar(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=utf8 COMMENT='省市区县信息';

/*Data for the table `b_province_info` */

insert  into `b_province_info`(`id`,`province_name`,`province_id`) values (1,'总部','09');
insert  into `b_province_info`(`id`,`province_name`,`province_id`) values (165,'湖北省','71');
insert  into `b_province_info`(`id`,`province_name`,`province_id`) values (166,'北京','11');
insert  into `b_province_info`(`id`,`province_name`,`province_id`) values (167,'江苏','34');

/*Table structure for table `cbss_order_info` */

DROP TABLE IF EXISTS `cbss_order_info`;

CREATE TABLE `cbss_order_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '流程id',
  `order_id` int(11) DEFAULT NULL COMMENT '订单id',
  `phone` varchar(13) DEFAULT NULL COMMENT '手机号',
  `product_name` varchar(30) DEFAULT NULL COMMENT '产品名称',
  `account` varchar(20) DEFAULT NULL COMMENT '账号',
  `password` varchar(20) DEFAULT NULL,
  `order_status` varchar(10) DEFAULT '-1' COMMENT '订购状态,-1待确认',
  `err_msg` text COMMENT '出错原因',
  `order_status_time` timestamp NULL DEFAULT NULL COMMENT '订购状态返回时间',
  `add_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录添加时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='ess订购记录表';

/*Data for the table `cbss_order_info` */

/*Table structure for table `product_info` */

DROP TABLE IF EXISTS `product_info`;

CREATE TABLE `product_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(50) DEFAULT NULL COMMENT '产品名称',
  `price` decimal(10,0) DEFAULT NULL COMMENT '价格',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=utf8 COMMENT='业务信息';

/*Data for the table `product_info` */

insert  into `product_info`(`id`,`product_name`,`price`) values (128,'4G半年包(100元1G立即生效)',100);
insert  into `product_info`(`id`,`product_name`,`price`) values (130,'WO+视频PPTV定向流量包月',15);
insert  into `product_info`(`id`,`product_name`,`price`) values (131,'WO+视频凤凰定向流量包月',15);
insert  into `product_info`(`id`,`product_name`,`price`) values (132,'WO+视频腾讯定向流量包月',15);
insert  into `product_info`(`id`,`product_name`,`price`) values (133,'QQ音乐',9);
insert  into `product_info`(`id`,`product_name`,`price`) values (137,'开机提醒',3);
insert  into `product_info`(`id`,`product_name`,`price`) values (138,'来电秘书',3);
insert  into `product_info`(`id`,`product_name`,`price`) values (140,'省内城市天气',3);
insert  into `product_info`(`id`,`product_name`,`price`) values (141,'沃酷狗',9);
insert  into `product_info`(`id`,`product_name`,`price`) values (146,'4G省内半年包(40元1.5G立即生效)',40);
insert  into `product_info`(`id`,`product_name`,`price`) values (148,'武汉通信无忧包1元版',1);

/*Table structure for table `product_relation` */

DROP TABLE IF EXISTS `product_relation`;

CREATE TABLE `product_relation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(10) DEFAULT NULL COMMENT '对应uc_hubei.product_info表的id字段',
  `cbss_order_code` varchar(50) DEFAULT NULL COMMENT 'cbss产品编码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Data for the table `product_relation` */

insert  into `product_relation`(`id`,`product_id`,`cbss_order_code`) values (1,130,'8000610700');
insert  into `product_relation`(`id`,`product_id`,`cbss_order_code`) values (2,131,'8000616600');
insert  into `product_relation`(`id`,`product_id`,`cbss_order_code`) values (3,132,'8000610900');
insert  into `product_relation`(`id`,`product_id`,`cbss_order_code`) values (4,133,'4900115200');
insert  into `product_relation`(`id`,`product_id`,`cbss_order_code`) values (5,137,'9071993101');
insert  into `product_relation`(`id`,`product_id`,`cbss_order_code`) values (6,138,'9071990805');
insert  into `product_relation`(`id`,`product_id`,`cbss_order_code`) values (7,140,'9071230301');
insert  into `product_relation`(`id`,`product_id`,`cbss_order_code`) values (8,141,'4900111900');
insert  into `product_relation`(`id`,`product_id`,`cbss_order_code`) values (9,146,'3002_100_1536_0');
insert  into `product_relation`(`id`,`product_id`,`cbss_order_code`) values (10,128,'3001_100_1024_0');
insert  into `product_relation`(`id`,`product_id`,`cbss_order_code`) values (11,148,'9071030701');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
