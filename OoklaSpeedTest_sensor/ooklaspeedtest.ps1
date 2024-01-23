#
.SYNOPSIS
	This script runs a speedtest using the Ookla API (httpswww.speedtest.netappscli).

.DESCRIPTION
	This script runs a speedtest using the Ookla API (httpswww.speedtest.netappscli).
	The output is XML (formatted for PRTG).
	Add a Filename and the same output will be saved to the named file.

.NOTES
	Version				 1.2
	Date				 13th April 2023
	Author				 Greig Sheridan
	See the credits at the bottom of the script

	Based on   httpsgithub.comgreiginsydneyGet-WeatherLinkData.ps1
	Blog post  httpsgreiginsydney.comNew-OoklaSpeedTest.ps1

	WISH-LIST  TODO

	KNOWN ISSUES

	Revision History 	
				v1.2 13th April 2023
					Zapped rogue ) in a debug logging line
					Signed the code
					Re-ordered the revision history, with newest now at the top
				v1.1 20th July 2020
					Added the -acceptGdpr switch
				v1.0 11th July 2020
					Initial release

.LINK
	httpsgreiginsydney.comNew-OoklaSpeedTest.ps1 - also httpsgithub.comgreiginsydneyNew-OoklaSpeedTest.ps1
	httpswww.speedtest.netappscli
	httpswww.speedtest.netabouteula
	httpswww.speedtest.netaboutterms
	httpswww.speedtest.netaboutprivacy

.EXAMPLE
	.New-OoklaSpeedTest.ps1 -precision 3

	Description
	-----------
	This executes a standard speed test against the default server for your location. Outputs to screen as XML (formatted for PRTG).
	The test results will be shown rounded to 3 decimal places.

.EXAMPLE
	.New-OoklaSpeedTest.ps1 -ServerId nnnn

	Description
	-----------
	Queries the Ookla server Id 'nnnn' and displays the output to screen and pipeline in PRTG XML format.
	('speedtest.exe -L' lists your nearest servers.)

.EXAMPLE
	.New-OoklaSpeedTest.ps1 -ServerId nnnn -Retries 2

	Description
	-----------
	Queries the Ookla server Id 'nnnn' and displays the output to screen and pipeline in PRTG XML format.
	If the first test fails it will initiate up to 2 more attempts before outputting a failure message.

.EXAMPLE
	.New-OoklaSpeedTest.ps1 -ServerId nnnn -FileName OoklaSpeedTest.xml

	Description
	-----------
	Queries the Ookla server Id 'nnnn' and displays the output on screen in PRTG XML format. The same output is written to the file at OoklaSpeedTest.xml.
	If that file apready exists it will be overwritten without prompting.

.EXAMPLE
	.New-OoklaSpeedTest.ps1 -FileName OoklaSpeedTest.xml -AcceptGdpr

	Description
	-----------
	Queries the default Ookla server for your location, displaying the output on screen in PRTG XML format & saving the same output to the file at OoklaSpeedTest.xml.
	If that file apready exists it will be overwritten without prompting.
	In the relevant Euro-zone locations, the -AcceptGdpr switch is required or the speedtest will not proceed.

.EXAMPLE
	.New-OoklaSpeedTest.ps1 -FileName OoklaSpeedTest.xml -Debug

	Description
	-----------
	Queries the default Ookla server for your location, displaying the output on screen in PRTG XML format & saving the same output to the file at OoklaSpeedTest.xml.
	If that file apready exists it will be overwritten without prompting.
	A debug New-OoklaSpeedTest-yyyyMMM.log will be saved in the same location as the script.


.PARAMETER ServerID
	String. The ID of a designated Ookla Server.

.PARAMETER FileName
	File name (and path if you wish) of a file to which the script will write the data. Any existing file of the same name will be over-written without prompting.

.PARAMETER Precision
	Integer. How many digits will be displayed after the decimal point. The default is 1, minimum is zero and maximum is 8.

.PARAMETER Retries
	Integer. How many attempts will be made to get a good Speed Test. The default is 2, minimum is zero and maximum is 4.

.PARAMETER AcceptGdpr
	Switch. If present, adds the --accept-gdpr switch to the Ookla query. This is required in Euro-zone countries only. (See httpswww.speedtest.netaboutprivacy)

.PARAMETER Debug
	Switch. If present, the script will drop a detailed debug log file into its own folder. One per month.

#

[CmdletBinding(SupportsShouldProcess = $False)]
param(
	[parameter(ValueFromPipeline, ValueFromPipelineByPropertyName = $true)]
	[string]$ServerId,
	[alias('File')][string]$FileName,
	[ValidateRange(0,8)]
	[int]$Precision=1,
	[ValidateRange(0,4)]
	[int]$Retries=2,
	[switch]$AcceptGdpr
)

$Error.Clear()		#Clear PowerShell's error variable
$GlobalDebug = $psboundparameters.debug.ispresent


#--------------------------------
# START CONSTANTS ---------------
#--------------------------------

#--------------------------------
# END CONSTANTS -----------------
#--------------------------------

#--------------------------------
# START FUNCTIONS ---------------
#--------------------------------

function logme
{
	param ([string]$message)

	if ($debug)
	{
		add-content -path $LogFile -value ('{0MMMdd-HHmm} {1}' -f (get-date), $message) -force
	}
}

#--------------------------------
# END FUNCTIONS -----------------
#--------------------------------


$scriptpath = $MyInvocation.MyCommand.Path
$dir = Split-Path -Path $scriptpath
$GlobalLogFile = (Join-Path -path $dir -childpath ((New-OoklaSpeedTest-{0yyyyMMM}.log) -f (Get-Date)))

logme ''
logme 'Launched'

if ($FileName)
{
	#If the user only provided a filename, add the script's path for an absolute reference
	if ([IO.Path]IsPathRooted($FileName))
	{
		#It's absolute. Safe to leave.
	}
	else
	{
		#It's relative.
		$FileName = [IO.Path]GetFullPath((Join-Path -path $dir -childpath $FileName))
	}
	logme ('Output file is     {0}' -f $Filename)
}
else
{
	logme 'No `$Filename provided. Outputting to screen only.'
}

$SpeedTestExe = Join-Path -path $dir -childpath 'Speedtest.exe'
if (test-path $SpeedTestExe)
{
	logme ('Speedtest found at {0}' -f $SpeedtestExe)
}
else
{
	$message = 'Speedtest not found in this directory. Aborting.'
	write-warning $message
	logme $message
	return	
}

$params = ''

if (!([string]IsNullorWhiteSpace($ServerId)))
{
	$params += --server-id=$($ServerId) 
}

if ($AcceptGdpr)
{
	$params += --accept-gdpr 
}

$params += --format=json --precision=$($precision) --accept-license 2&1	# Append the handler that will capture errors
logme ('Params   = {0}' -f $params)

$Success = $false
$Attempt = 0
nextAttempt while ($retries - $attempt -ge 0)
{
	$attempt ++
	write-verbose Attempt #$($attempt)
	try
	{
		$response = Invoke-Expression & '$SpeedTestExe' $params 	# $Response will contain what
		logme Response = $response
		$result = $response  convertfrom-json
		if ($result.type -eq result)
		{
			$success = $true
			break
		}
	}
	catch 
	{
		$result = Error caught by handler $_
		logme $result
	}
	start-sleep -seconds 5
	logme Retrying 
}

[xml]$Doc = New-Object System.Xml.XmlDocument
$dec = $Doc.CreateXmlDeclaration('1.0','UTF-8',$null)
$doc.AppendChild($dec)  Out-Null
$root = $doc.CreateNode('element','prtg',$null)
	
if ($Success)
{
	logme ('InternalIp    {0}' -f ($result.interface).InternalIp)
	logme ('IsVpn         {0}' -f ($result.interface).IsVpn)
	logme ('ExternalIp    {0}' -f ($result.interface).ExternalIp)
	logme ('ISP           {0}' -f ($Result.isp))
	logme ('ID            {0}' -f ($result.server).id)
	logme ('Name          {0}' -f ($result.server).name)
	logme ('Location      {0}' -f ($result.server).location)
	logme ('Country       {0}' -f ($result.server).country)
	logme ('Host          {0}' -f ($result.server).host)
	logme ('IP            {0}' -f ($result.server).ip)
	logme ('Download bw  {0}' -f ($result.download).bandwidth)
	logme ('Upload bw    {0}' -f ($result.upload).bandwidth)
	logme ('Jitter        {0}' -f ($result.ping).jitter)
	logme ('Latency       {0}' -f ($result.ping).latency)
	logme ('Packet loss   {0}' -f $result.packetLoss)
	
	foreach ($Title in @('Download Speed', 'Upload Speed' , 'Latency', 'Jitter', 'Packet Loss'))
	{
		$child = $doc.CreateNode('element','Result',$null)
		$ChannelElement = $doc.CreateElement('Channel')
		$UnitElement = $doc.CreateElement('customUnit')
		$FloatElement = $doc.CreateElement('float');
		$ValueElement = $doc.CreateElement('value');
		$ChartElement = $doc.CreateElement('showChart');
		$TableElement = $doc.CreateElement('showTable');

		switch ($Title)
		{
			'Download Speed'
			{
				$channelelement.innertext = $Title;
				$Value = [math]round(($result.download).bandwidth  125000, $precision);
				$UnitElement.InnerText = 'Mbs';
				$FloatElement.InnerText = '1';
				$ChartElement.InnerText = '1';
				$TableElement.InnerText = '1';
			}
			'Upload Speed'
			{
				$channelelement.innertext = $Title;
				$Value = [math]round(($result.upload).bandwidth  125000, $precision);
				$UnitElement.InnerText = 'Mbs';
				$FloatElement.InnerText = '1';
				$ChartElement.InnerText = '1';
				$TableElement.InnerText = '1';
			}
			'Latency'
			{
				$channelelement.innertext = $Title;
				$Value = [math]round(($result.ping).latency, $precision);
				$UnitElement.InnerText = 'ms';
				$FloatElement.InnerText = '1';
				$ChartElement.InnerText = '1';
				$TableElement.InnerText = '1';
			}
			'Jitter'
			{
				$channelelement.innertext = $Title;
				$Value = [math]round(($result.ping).jitter, $precision);
				$UnitElement.InnerText = 'ms';
				$FloatElement.InnerText = '1';
				$ChartElement.InnerText = '1';
				$TableElement.InnerText = '1';
			}
			'Packet Loss'
			{
				$channelelement.innertext = $Title;
				$Value = [math]round($result.packetLoss, $precision);
				$UnitElement.InnerText = '%';
				$FloatElement.InnerText = '0';
				$ChartElement.InnerText = '1';
				$TableElement.InnerText = '1';
			}
			default { continue }
		}
		$child.AppendChild($ChannelElement)	 Out-Null;
		$child.AppendChild($UnitElement)	 out-null;
		$child.AppendChild($FloatElement)	 out-null;
		$ValueElement.InnerText = $Value
		$child.AppendChild($ValueElement)	 out-null;
		$child.AppendChild($ChartElement)	 out-null;
		$child.AppendChild($TableElement)	 out-null;
		#append to root
		$root.AppendChild($child)  Out-Null
	}
}
else
{
	$child = $doc.CreateNode('element','error',$null)
	$child.InnerText = '1';
	$root.AppendChild($child)  Out-Null
	$child = $doc.CreateNode('element','text',$null)
	$child.InnerText = 'error';
	#append to root
	$root.AppendChild($child)  Out-Null
}
$doc.AppendChild($root)  Out-Null
$doc.InnerXML
if ($FileName) { $doc.Save($Filename)}

logme 'Exited cleanly.'

# CREDITS

# With thanks to DigiCert for the code-signing certificate
# SIG # Begin signature block
# MIInwYJKoZIhvcNAQcCoIIn8DCCJ+wCAQExCzAJBgUrDgMCGgUAMGkGCisGAQQB
# gjcCAQSgWzBZMDQGCisGAQQBgjcCAR4wJgIDAQAABBAfzDtgWUsITrck0sYpfvNR
# AgEAAgEAAgEAAgEAAgEAMCEwCQYFKw4DAhoFAAQUFvlYEyozHY9dwZ54PDOK4s6y
# 06ggiEnMIIFjTCCBHWgAwIBAgIQDpsYjvnQLefv21DiCEAYWjANBgkqhkiG9w0B
# AQwFADBlMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYD
# VQQLExB3d3cuZGlnaWNlcnQuY29tMSQwIgYDVQQDExtEaWdpQ2VydCBBc3N1cmVk
# IElEIFJvb3QgQ0EwHhcNMjIwODAxMDAwMDAwWhcNMzExMTA5MjM1OTU5WjBiMQsw
# CQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3d3cu
# ZGlnaWNlcnQuY29tMSEwHwYDVQQDExhEaWdpQ2VydCBUcnVzdGVkIFJvb3QgRzQw
# ggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQC5pBzaN675F1KPDAiMGkz
# 7MKnJS7JIT3yithZwuEppz1Yq3aaza57G4QNxDAf8xukOBbrVsaXbR2rsnnyyhHS
# 5FWBTxSD1Ifxp4VpX6+n6lXFllVcq9ok3DCsrp1mWpzMpTREEQQLt+C8weE5nQ7
# bXHiLQwb7iDVySAdYyktzuxeTsiT+CFhmzTrBcZe7FsavOvJz82sNEBfsXpm7nfI
# SKhmV1efVFiODCu3T6cw2Vbuyntd463JT17lNecxy9qTXtyOj4DatpGYQJB5w3jH
# trHEtWoYOAMQjdjUN6QuBX2I9YI+EJFwq1WCQTLX2wRzKm6RAXwhTNS8rhsDdV14
# Ztk6MUSaM0CCNdaSaTC5qmgZ92kJ7yhTzm1EVgX9yRcRo9k98FpiHaYdj1ZXUJ2
# h4mXaXpI8OCiEhtmmnTK3kse5w5jrubU75KSOp493ADkRSWJtppEGSt+wJS00mFt
# 6zPZxd9LBADMfRyVw43IbKyEbe7fLVjHAsQWCqsWMYRJUadmJ+9oCw++hkpjPR
# iQfhvbfmQ6QYuKZ3AeEPlAwhHbJUKSWJbOUOUlFHdL4mrLZBdd56rF+NP8m800ER
# ElvlEFDrMcXKchYiCd98THUY+whX8QgUWtvsauGi0C1kVfnSD8oR7FwI+isX4K
# Jpn15GkvmB0t9dmpsh3lGwIDAQABo4IBOjCCATYwDwYDVR0TAQHBAUwAwEBzAd
# BgNVHQ4EFgQU7NfjgtJxXWRM3y5nP+e6mK4cD08wHwYDVR0jBBgwFoAUReuirSS
# y4IxLVGLp6chnfNtyA8wDgYDVR0PAQHBAQDAgGGMHkGCCsGAQUFBwEBBG0wazAk
# BggrBgEFBQcwAYYYaHR0cDovL29jc3AuZGlnaWNlcnQuY29tMEMGCCsGAQUFBzAC
# hjdodHRwOi8vY2FjZXJ0cy5kaWdpY2VydC5jb20vRGlnaUNlcnRBc3N1cmVkSURS
# b290Q0EuY3J0MEUGA1UdHwQ+MDwwOqA4oDaGNGh0dHA6Ly9jcmwzLmRpZ2ljZXJ0
# LmNvbS9EaWdpQ2VydEFzc3VyZWRJRFJvb3RDQS5jcmwwEQYDVR0gBAowCDAGBgRV
# HSAAMA0GCSqGSIb3DQEBDAUAA4IBAQBwoL9DXFXnOF+go3QbPbYW1eVwe9mqyh
# hyzshV6pGrsi+IcaaVQi7aSId229GhT0E0p6Ly23OO04C5+KH38nLeJLxSA8hO
# 0Cre+i1Wzn096wwepqLsl7Uz9FDRJtDIeuWcqFItJnLnU+nBgMTdydE1Od6Fmo
# 8L8vC6bp8jQ87PcDx4eo0kxAGTVGamlUsLihVo7spNU96LHcRzY9HdaXFSMb++h
# UD38dglohJ9vytsgjTVgHAIDyyCwrFigDkBjxZgiwbJZ9VVrzyerbHbObyMt9H5x
# aiNrIv8SuFQtJ37YOtnwtoeWVvRXKwYw02fc7cBqZ9Xql4o4rmUMIIGrjCCBJag
# AwIBAgIQBzY3tyRUfNhHrP0oZipeWzANBgkqhkiG9w0BAQsFADBiMQswCQYDVQQG
# EwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3d3cuZGlnaWNl
# cnQuY29tMSEwHwYDVQQDExhEaWdpQ2VydCBUcnVzdGVkIFJvb3QgRzQwHhcNMjIw
# MzIzMDAwMDAwWhcNMzcwMzIyMjM1OTU5WjBjMQswCQYDVQQGEwJVUzEXMBUGA1UE
# ChMORGlnaUNlcnQsIEluYy4xOzA5BgNVBAMTMkRpZ2lDZXJ0IFRydXN0ZWQgRzQg
# UlNBNDA5NiBTSEEyNTYgVGltZVN0YW1waW5nIENBMIICIjANBgkqhkiG9w0BAQEF
# AAOCAg8AMIICCgKCAgEAxoY1BkmzwT1ySVFVxyUDxPKRN6mXUaHW0oPRnkyibaCw
# zIP5WvYRoUQVQl+kiPNo+n3znIkLf50fng8zH1ATCyZzlm34V6gCff1DtITaEfFz
# sbPuK4CEiiIY3+vaPcQXf6sZKz5C3GeO6lE98NZW1OcoLevTsbV15x8GZY2UKdPZ
# 7Gnf2ZCHRgB720RBidx8ald68Dd5n12sy+iEZLRS8nZH92GDGd1ftFQLIWhuNyG7
# QKxfst5Kfc71ORJn7w6lY2zkpsUdzTYNXNXmG6jBZHRAp8ByxbpOH7G1WE15teP
# c5OsLDnipUjW8LAxE6lXKZYnLvWHpo9OdhVVJnCYJn+gGkcgQ+NDY4B7dW4nJZCY
# OjgRsb2nuY7W+yB3iIU2YIqx5KoN7jPqJz+ucfWmyU8lKVEStYdEAoq3NDzt9K
# oRxrOMUp88qqlnNCaJ+2RrOdOqPVA+C8KI8ykLcGEhFDTP0kyr75s9g64ZCr6
# dSgkQe1CvwWcZklSUPRR8zZJTYsg0ixXNXkrqPNFYLwjjVj33GHek45wPmyMKVM
# 1+mYSlg+0wOIrOP015LdhJRk8mMDDtbiiKowSYI+RQQEgN9XyO7ZONj4KbhPvbC
# dLIHgl27KtdRnXiYKNYCQEoAA6EVO7O6V3IXjASvUaetdN2udIOa5kM0jO0zbEC
# AwEAAaOCAV0wggFZMBIGA1UdEwEBwQIMAYBAf8CAQAwHQYDVR0OBBYEFLoW2W1N
# hS9zKXaaL3WMaiCPnshvMB8GA1UdIwQYMBaAFOzX44LScV1kTN8uZznupiuHA9P
# MA4GA1UdDwEBwQEAwIBhjATBgNVHSUEDDAKBggrBgEFBQcDCDB3BggrBgEFBQcB
# AQRrMGkwJAYIKwYBBQUHMAGGGGh0dHA6Ly9vY3NwLmRpZ2ljZXJ0LmNvbTBBBggr
# BgEFBQcwAoY1aHR0cDovL2NhY2VydHMuZGlnaWNlcnQuY29tL0RpZ2lDZXJ0VHJ1
# c3RlZFJvb3RHNC5jcnQwQwYDVR0fBDwwOjA4oDagNIYyaHR0cDovL2NybDMuZGln
# aWNlcnQuY29tL0RpZ2lDZXJ0VHJ1c3RlZFJvb3RHNC5jcmwwIAYDVR0gBBkwFzAI
# BgZngQwBBAIwCwYJYIZIAYb9bAcBMA0GCSqGSIb3DQEBCwUAA4ICAQB9WY7Ak7Zv
# mKlEIgF+ZtbYIULhsBguEE0TzzBTzr8Y+8dQXeJLKftwig2qKWn8acHPHQfpPmDI
# 2AvlXFvXbYf6hCAlNDFnzbYSlmEUExiHQwIgqgWvalWzxVzjQEiJc6VaT9Hdty
# dBTX6tPiix6q4XNQ1tYLaqT5Fmniye4Iqs5f2MvGQmh2ySvZ180HAKfO+ovHVP
# ulr3qRCyXenKFSJ8NWKcXZl2szwcqMj+sAngkSumScbqyQeJsG33irr9p6xeZmB
# o1aGqwpFydEjaDnmPv7pp1yr8THwcFqcdnGE4AJxLafzYeHJLtPo0m5d2aR8XKc
# 6UsCUqc3fpNTrDsdCEkPlM05et3JWOZJyw9P2un8WbDQc1PtkCbISFA0LcTJM3c
# HXg65J6t5TRxktcma+Q4c6umAU+9Pzt4rUyt+8SVe+0KXzM5h0F4ejjpnOHdI0d
# KNPH+ejxmF7K9h+8kaddSweJywm228Vex4Ziza4k9Tm8heZWcpw8DemADfIBZP
# JtgZxahZrrdVcA6KYawmKAr7ZVBtzrVFZgxtGIJDwq9gdkTr+k0fNX2bwE+oLe
# Mt8EifAAzV3C+dAjfwAL5HYCJtnwZXZCpimHCUcr5n8apIUPJiW9lVUKx+A+sDy
# Divl1vupL0QVSucTDh3bNzgaoSv27dZ8DCCBrAwggSYoAMCAQICEAitQLJg0pxM
# n17Nqb2TrtkwDQYJKoZIhvcNAQEMBQAwYjELMAkGA1UEBhMCVVMxFTATBgNVBAoT
# DERpZ2lDZXJ0IEluYzEZMBcGA1UECxMQd3d3LmRpZ2ljZXJ0LmNvbTEhMB8GA1UE
# AxMYRGlnaUNlcnQgVHJ1c3RlZCBSb290IEc0MB4XDTIxMDQyOTAwMDAwMFoXDTM2
# MDQyODIzNTk1OVowaTELMAkGA1UEBhMCVVMxFzAVBgNVBAoTDkRpZ2lDZXJ0LCBJ
# bmMuMUEwPwYDVQQDEzhEaWdpQ2VydCBUcnVzdGVkIEc0IENvZGUgU2lnbmluZyBS
# U0E0MDk2IFNIQTM4NCAyMDIxIENBMTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCC
# AgoCggIBANW0L0LQKK14t13VOVkbsYhC9TOM6z2Bl3DFu8SFJjCfpI5o2Fz16zQk
# B+FLT9N4QQX1x7a+dLVZxpSTw6hVyImcGRzIEDPk1wJGSzjeIIfTR9TIBXEmtD
# mpnyxTsf8uLR1oTpkyzASAl8xDTi7L7CPCK4J0JwGWn+piASTWHPVEZ6JAheEUu
# oZ8s4RjCGszF7pNJcEIyjvG6hzzZWiRok1MghFIUmjeEL0UV13oGBNlxX+yT4Us
# SKRWhDXW+S6cqgAV0Tf+GgaUwnzI6hsy5srC9KejAw50pa85tqtgEuPo1rn3MeHc
# reQYoNjBI0dHs6EPbqOrbZgGgxu3amct0r1EGpIQgY+wOwnXx5syWsLamBUi0nB
# k+3htFzgb+sm+YzVsvk4EObqzpH1vtP7b5NhNFy8k0UogzYqZihfsHPOiyYlBrKD
# 1Fz2FRlM7WLgXjPy6OjsCqewAyuRsjZ5vvetCB51pmXMu+NIUPN3kRr+21CiRshh
# WJj1fAIWPIMorTmG7NS3DVPQ+EfmdTCN7DCTdhSmW0tddGFNPxKRdt6WMtyEClB
# 8NXFbSZ2aBFBE1ia3CYrAfSJTVnbeM+BSj5AR1JgVBzhRAjIVlgimRUwcwhGug4
# GXxmHM14OEUwmUY09Mu6oNCFNBfFg9R7P6tuyMMgkCzGw8DFYRAgMBAAGjggFZ
# MIIBVTASBgNVHRMBAf8ECDAGAQHAgEAMB0GA1UdDgQWBBRoN+Drtjv4XxGG+5h
# ewiIZfROQjAfBgNVHSMEGDAWgBTs1+OC0nFdZEzfLmc57qYrhwPTzAOBgNVHQ8B
# Af8EBAMCAYYwEwYDVR0lBAwwCgYIKwYBBQUHAwMwdwYIKwYBBQUHAQEEazBpMCQG
# CCsGAQUFBzABhhhodHRwOi8vb2NzcC5kaWdpY2VydC5jb20wQQYIKwYBBQUHMAKG
# NWh0dHA6Ly9jYWNlcnRzLmRpZ2ljZXJ0LmNvbS9EaWdpQ2VydFRydXN0ZWRSb290
# RzQuY3J0MEMGA1UdHwQ8MDowOKA2oDSGMmh0dHA6Ly9jcmwzLmRpZ2ljZXJ0LmNv
# bS9EaWdpQ2VydFRydXN0ZWRSb290RzQuY3JsMBwGA1UdIAQVMBMwBwYFZ4EMAQMw
# CAYGZ4EMAQQBMA0GCSqGSIb3DQEBDAUAA4ICAQA6I0Q9jQh27o+8OpnTVuACGqX4
# SDTzLLbmdGb3lHKxAMqvbDAnExKekESfS2eo3wm1Te8Ol1IbZXVP0n0J7sWgUVQ
# Zy9toXgdn43ccsi91qqkM1k2rj6yDR1VB5iJqKisG2vaFIGH7c2IAaERkYzWGZ
# gVb2yeN258TkG19D+D6U3Y5PZ7Umc9K3SjrXyahlVhI1Rr+1ycZDRdobdHLBg
# XPMNqO7giaG9OeE4Ttpuuzad++UhU1rDyulq8aI+20O4M8hPOBSSmfXdzlRt2V0C
# FB9AM3wD4pWywiF1c1LLRtjENByipUuNzW92NyyFPxrOJukYvpAHsENlYgggnDw
# zMrvSk1XB+JOFX3N4qLCaHLC+kxGv8uGVw5ceG+nKcKBtYmZ7eS5k5f3nqsSc8u
# pHSSrds8pJyGH+PBVhsrI+PteqIe3Br5qC6ToRabE6BaRUotBwEiES5ZNq0RA
# 443wFSjO7fEYVgcqLxDEDAhkPDOPriiMPMuPiAsNvzv0zh57ju+168u38HcT5uco
# P6wSrqUvImxB+YJcFWbMbA7KxYbD9iYzDAdLoNMHAmpqQDBISzSoUSC7rRuFCOJZ
# DW3KBVAr6kocnqX9oKcfBnTn8tZSkP2vhUgh+Vc7tJwD7YZF9LRhbr9o4iZghurI
# r6n+lB3nYxs6hlZ4TjCCBsAwggSooAMCAQICEAxNaXJLlPo8Kko9KQeAPVowDQYJ
# KoZIhvcNAQELBQAwYzELMAkGA1UEBhMCVVMxFzAVBgNVBAoTDkRpZ2lDZXJ0LCBJ
# bmMuMTswOQYDVQQDEzJEaWdpQ2VydCBUcnVzdGVkIEc0IFJTQTQwOTYgU0hBMjU2
# IFRpbWVTdGFtcGluZyBDQTAeFw0yMjA5MjEwMDAwMDBaFw0zMzExMjEyMzU5NTla
# MEYxCzAJBgNVBAYTAlVTMREwDwYDVQQKEwhEaWdpQ2VydDEkMCIGA1UEAxMbRGln
# aUNlcnQgVGltZXN0YW1wIDIwMjIgLSAyMIICIjANBgkqhkiG9w0BAQEFAAOCAg8A
# MIICCgKCAgEAz+ylJjrGqfJru43BDZrboegUhXQzGias0BxVHh42bbySVQxh9J0J
# dz0Vlggva2SkQaDFteRkjgcMQKW+3KxlzpVrzPsYYrppijbkGNcvYlT4DotjIdC
# riak5Lt4eLl6FuFWxsC6ZFO7KhbnUEi7iGkMiMbxvuAvfTuxylONQIMe58tySSge
# TIAehVbnhe3yYbyqOgd99qtu5Wbd4lz1L+2N1E2VhGjjgMtqedHSEJFGKes+JvK0
# jM1MuWbIu6pQOA3ljJRdGVq9XtAbm8WqJqclUeGhXk+DF5mjBoKJL6cqtKctvdP
# bnjEKD+jHA9QBje6CNk1prUe2nhYHTno+EyREJZ+TeHdwq2lfvgtGxsK0YYoxn2
# Off1wU9xLokDEaJLu5i+kkezbvBkTkVf826uV8MefzwlLE5hZ7Wn6lJXPbwGqZ
# IS1j5Vn1TS+QHye30qsU5Thmh1EIatTQznQZPpWz+D0CuYUbWR4u5j9lMNzIfMv
# wi4g14Gs0EH1OG92V1LbjGUKYvmQaRllMBY5eUuKZCmt2Fk+tkgbBhRYLqmgQ8J
# JVPxvzvpqwcOagc5YhnJ1oVE9mNec9ixezhe7nMZxMHmsF47caIyLBuMnnHC1mD
# jcbu9Sx8e47LZInxscS451NeX1XSfRkpWQNO+l3qRXMchH7XzuLUOncCAwEAAaOC
# AYswggGHMA4GA1UdDwEBwQEAwIHgDAMBgNVHRMBAf8EAjAAMBYGA1UdJQEBwQM
# MAoGCCsGAQUFBwMIMCAGA1UdIAQZMBcwCAYGZ4EMAQQCMAsGCWCGSAGGWwHATAf
# BgNVHSMEGDAWgBS6FtltTYUvcyl2mi91jGogj57IbzAdBgNVHQ4EFgQUYore0GH8
# jzEU7ZcLzT0qlBTfUpwwWgYDVR0fBFMwUTBPoE2gS4ZJaHR0cDovL2NybDMuZGln
# aWNlcnQuY29tL0RpZ2lDZXJ0VHJ1c3RlZEc0UlNBNDA5NlNIQTI1NlRpbWVTdGFt
# cGluZ0NBLmNybDCBkAYIKwYBBQUHAQEEgYMwgYAwJAYIKwYBBQUHMAGGGGh0dHA6
# Ly9vY3NwLmRpZ2ljZXJ0LmNvbTBYBggrBgEFBQcwAoZMaHR0cDovL2NhY2VydHMu
# ZGlnaWNlcnQuY29tL0RpZ2lDZXJ0VHJ1c3RlZEc0UlNBNDA5NlNIQTI1NlRpbWVT
# dGFtcGluZ0NBLmNydDANBgkqhkiG9w0BAQsFAAOCAgEAVaoqGvNG83hXNzD8deNP
# 1oUj8fz5lTmbJeb3coqYw3fUZPwV+zbCSVEseIhjVQlGOQD8adTKmyn7ozAyQCb
# Ex2wmIncePLNfIXNU52vYuJhZqMUKkWHSphCK1D8G7WeCDAJ+uQt1wmJefkJ5ojO
# fRu4aqKbwVNgCeijuJ3XrR8cuOyYQfD2DoD75PfnRCn6wC6X0qPGjpStOqCUkV
# NTZZmg9U0rIbf35eCa12VIp0bcrSBWcrduvmLImlTgZiEQU5QpZomvnIj5EIdI
# HMCb7XxIstiSDJFPPGaUr10CU+ue4p7k0x+GAWScAMLpWnR1DT3heYiHAGXyRkj
# gNc2Wl+WFrFjDMZGQDvOXTXUWT5Dmhiuw8nLwubE19qtcfg8wXDWd8nYiveQclT
# uf80EGf2JjKYe5cQpSBlIKdrAqLxksVStOYkEVgM4DgI974A6T2RUflzrgDQkfo
# QTZxd639ouiXdE4u2h4djFrIHprVwvDGIqhPm73YHJpRxC+a9l+nJ5e6li6FV8Bg
# 53hWf2rvwpWaSxECyIKcyRoFfLpxtU56mWz06J7UWpjIn7+NuxhcQXQKujiYu54
# BNu90ftbCqhwfvCXhHjjCANdRyxjqCU4lwHSPzra5eX25pvcfizMxdMTQCi2NYB
# DriL7ubgclWJLCcZYfZ3AYwwggdoMIIFUKADAgECAhAMMzQ0LuAfmONmPyLmRf1d
# MA0GCSqGSIb3DQEBCwUAMGkxCzAJBgNVBAYTAlVTMRcwFQYDVQQKEw5EaWdpQ2Vy
# dCwgSW5jLjFBMD8GA1UEAxM4RGlnaUNlcnQgVHJ1c3RlZCBHNCBDb2RlIFNpZ25p
# bmcgUlNBNDA5NiBTSEEzODQgMjAyMSBDQTEwHhcNMjIwNjI3MDAwMDAwWhcNMjMw
# ODA5MjM1OTU5WjBtMQswCQYDVQQGEwJBVTEYMBYGA1UECBMPTmV3IFNvdXRoIFdh
# bGVzMRIwEAYDVQQHEwlBZGFtc3Rvd24xFzAVBgNVBAoTDkdyZWlnIFNoZXJpZGFu
# MRcwFQYDVQQDEw5HcmVpZyBTaGVyaWRhbjCCAiIwDQYJKoZIhvcNAQEBBQADggIP
# ADCCAgoCggIBAOFVlQtjwzC7IMPzHlD6cagkjS1764l11Bb9cKAVq0UliIcTgh2
# 02wsqHSmpPuamo5XeIB+G74CG9oZFztMbm7HbE5UeuRkppwFCzAFilOX2gZWLPz
# ZLXMc4O80NOpQTbNQ7OgecpSaSHnKCv36CJdQ19jtmqHEqFLAT24raoT94JqQZ5b
# JG35zhSyfCyXZcGnejOfnF3zmtoTSZGDo5o1s29r4kIWk3vpZGK5hNnidHJSDULc
# WC7TVpRz1dL04Ce1KalnwSCW6FCJQ508vK3g4t6SEGBes7Ph35B8t4gvQ26oDlwV
# ugrUu+p4ynCP4OT5LY4gW627KbZgmtvgXUSfjNrgDAZN9VaMywaSM5JKxhKUfvNv
# Z1GF4yOgq3OKFCPczPcEkyxEe5X+Tks75u75GRnsosYQV9NGxVLrEghs2Iwir
# 1e9DKMjRY0am0PAnbuvGvcKZ2jvMPUevNu5nV9tiPH+aDwQ34BAb5qC89NoYEpdH
# yNw37+SlTgKmEGNhows72QbjWLcTFPo+uG+un2pjz6uMlSJLpb2TyQ796sFJP7+
# oZhYoXqgAYTtWrcYYut+kFPCuz7fUjIOBcdGa8eVvwh9npdAnFgR5f9T+cMj5x
# 6Y+GLQVDTwwbUTjddAbaRvReTWSdcHytzkg7YSB0mD1OjK9J6JDilh5AgMBAAGj
# ggIGMIICAjAfBgNVHSMEGDAWgBRoN+Drtjv4XxGG+5hewiIZfROQjAdBgNVHQ4E
# FgQUUV9c4ckSxE0FGN1P7PQWXIrcnQwDgYDVR0PAQHBAQDAgeAMBMGA1UdJQQM
# MAoGCCsGAQUFBwMDMIG1BgNVHR8Ega0wgaowU6BRoE+GTWh0dHA6Ly9jcmwzLmRp
# Z2ljZXJ0LmNvbS9EaWdpQ2VydFRydXN0ZWRHNENvZGVTaWduaW5nUlNBNDA5NlNI
# QTM4NDIwMjFDQTEuY3JsMFOgUaBPhk1odHRwOi8vY3JsNC5kaWdpY2VydC5jb20v
# RGlnaUNlcnRUcnVzdGVkRzRDb2RlU2lnbmluZ1JTQTQwOTZTSEEzODQyMDIxQ0Ex
# LmNybDA+BgNVHSAENzA1MDMGBmeBDAEEATApMCcGCCsGAQUFBwIBFhtodHRwOi8v
# d3d3LmRpZ2ljZXJ0LmNvbS9DUFMwgZQGCCsGAQUFBwEBBIGHMIGEMCQGCCsGAQUF
# BzABhhhodHRwOi8vb2NzcC5kaWdpY2VydC5jb20wXAYIKwYBBQUHMAKGUGh0dHA6
# Ly9jYWNlcnRzLmRpZ2ljZXJ0LmNvbS9EaWdpQ2VydFRydXN0ZWRHNENvZGVTaWdu
# aW5nUlNBNDA5NlNIQTM4NDIwMjFDQTEuY3J0MAwGA1UdEwEBwQCMAAwDQYJKoZI
# hvcNAQELBQADggIBAF2D+PsiX8TfULf7wjm8oZ0BvJfJL4k7pCjjksvnuFkor+
# kpa+dXjpsSv1psIlo7aoiSYn+cPTF0g4Mc7R4P4ZDy4IKXPvtBOs95ruE5cryeP
# K5CAl1T5nQbHDC9Ym073UUZRqxHdXe7c7OU0OUlMON0BmhXmwY608jmHZ63tYkK
# lOrj6TC+FvJ+WeT7zvjf71t0frqZLEYGvBBdnCphHtxe0raLlV5lcaWXlXjQ
# 3FX4ZdyOMayWTCiZ1z4EnfxoI6Cd+wUmcqjmcyPCCuVd2TeNJOE3BEQCUZyHa
# AFaE2m+sArx9nHy8Cc5CUTQH7Cf4tbJEI71qYIvYff6dLUhDqRvocpfSi5fq4col
# uXwIXbJ6cjAMFIySRGBg7rx2A3XVvSS4dAVKWFMnsoNF2l9wfyM63dPGImepTATn
# pDoqUQQqiCLFjuVztO+UJ1bOfhEHHZQGL+yZRBz61rpaTtz5xo5Tq72ev8HFWslR
# xVF8Y4GiwR0rVmv6lEWeASlMUdRHwCwyky9xnrf1OBIuMthnYi14QrKh1a3NdtSy
# NdhQsLpR1SRRT4DBGCZXJy7fY+sU7b7gkYSTHYyCf5KhRrqWaTOgz7ODwDA0SIIs
# dbY+AY8vbmTEuCbFALs9TOCrvMMriINikvokTZrRoiHwuDbnB3cIyCDGT6b1MYIG
# QjCCBj4CAQEwfTBpMQswCQYDVQQGEwJVUzEXMBUGA1UEChMORGlnaUNlcnQsIElu
# Yy4xQTABgNVBAMTOERpZ2lDZXJ0IFRydXN0ZWQgRzQgQ29kZSBTaWduaW5nIFJT
# QTQwOTYgU0hBMzg0IDIwMjEgQ0ExAhAMMzQ0LuAfmONmPyLmRf1dMAkGBSsOAwIa
# BQCgeDAYBgorBgEEAYI3AgEMMQowCKACgAChAoAAMBkGCSqGSIb3DQEJAzEMBgor
# BgEEAYI3AgEEMBwGCisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMCMGCSqGSIb3
# DQEJBDEWBBQLDMhDGLaDJKOvpMHc0R6oVOAv8zANBgkqhkiG9w0BAQEFAASCAgDU
# 8aCe+vhtviVt9w3+pOoqZyP3qnYUFghBpt6n1hRB94lPoVkSvyU4HZNPh6BIfV8I
# 9FxXZGAwaiGeuafeK2JFslaTBlD6AkBBr+MqLLknddMcjQqEBsDiylzAIjKM1m
# peaxibDBnruDGOgd8o1au61AQNzw0fVtZsbTskA+baqdgXBjDqIdLauJuxfy8q
# 9rWolYqFLdjiHxSAsVmBPL06f5PrfsyAO9c1m5DqyNxKAA5iCioua4P1VXdAzpZ
# lWeshzs9EZBGuPujqsjr9eKg2qgvL5OI5aKRVrrq1kCSPOpdK7WmPffR5fjrZCO
# WNasAJxv1qdCnYYplozb9vKqnt1BuoWUAXfWcsyoZJuTqgbLt4yFGhw9WHnGOZ9
# LnlkQxbNA2qadCODq4EnTNNaoCjEDFRbDbPy5VnPK8zc42SQCNpxdN80B+mLfg6N
# eVeyAI+d1wzKDYLIo35ZjdVINw4xe2wcacTYgMcjMo3Hgiyv5b08KZF0IfAmG3UG
# GNDXSj6Yi5yfDTl5QtxN4ESX1CJZ9vfceN7yP0INgJHkv9tbRJyhL2GCA69zkMM
# ZpoaUu1wiXmwX5HV7VKowBjogaxLrQ2o2MhRCRjta33wd1vC8yRL88BZTC2WZkl
# KCsa+URu2fiHp6fiusRzhoGFN+iT8ik3FEaYr3AiKKGCAyAwggMcBgkqhkiG9w0B
# CQYxggMNMIIDCQIBATB3MGMxCzAJBgNVBAYTAlVTMRcwFQYDVQQKEw5EaWdpQ2Vy
# dCwgSW5jLjE7MDkGA1UEAxMyRGlnaUNlcnQgVHJ1c3RlZCBHNCBSU0E0MDk2IFNI
# QTI1NiBUaW1lU3RhbXBpbmcgQ0ECEAxNaXJLlPo8Kko9KQeAPVowDQYJYIZIAWUD
# BAIBBQCgaTAYBgkqhkiG9w0BCQMxCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEP
# Fw0yMzA0MTMwNDMwMTBaMC8GCSqGSIb3DQEJBDEiBCBQp0BcqNwz4w46cUvKOjhh
# zvzWDeBkCW8ABT8iyQVIDANBgkqhkiG9w0BAQEFAASCAgC6fw4jYrQ4EBB78iES
# y79U4tw+iYKQrwzyx5AxPsPmkVHpVEeAaeQ6sqioZfgXdKZJUvYUC2I5Jki1Yp
# 34Mi6S41gqJdcD3yA6PJaB2Ibf1FPIFWU8hSRZlxsbU6ebwh+Tn2oOqjldfHwRko
# WNuTmCeE78VCcEMHmmYy3BxVyAb8e8576G9Xpnzky0GULcay+8jHKbPxcGmZCm
# trwFOSJmnh2idJsqI+5n6YHFRUUSGlyPxO6BrBdCoIPg6lX3cyEHRWxVV63h4
# yPsFIdLR37+PAH25ppNhGmF7dGcrEOXUnE3C7tVwPS1RDSHgLI8NsCG8jUBJyp
# xvrrx7g6Vhh9aqKVQSCOQAFtqarlvATnBYRxDzAbzkuJFeRFnqVi72XajPNlnv
# QCSRSreoWwnbWVVd9nAvkO4FjWtyLaaRFaER3HOKUUqBtuIywWid86MpR2iMiXHQ
# xkZLvY098QfyBB3DNm00dymKVRu9pR2Hp0XKa28yNJtsIWrSOvsHBds6j4nhM
# pJScqKGhh4HOq1d4ehG4xXSA3+K8n4WHiC+cbC066Wkb6TrZZIIIKl3Cqubwb
# ZEMrSNFfd5URVXvLauPXtIHmT59O6d9MzFfDF8WPqiTya7Vb6keKsiiAJ+Rr2
# M0E+fFLERXWFvE7K856Hn1k5XQ==
# SIG # End signature block